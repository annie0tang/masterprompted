// src/components/RemovedTextSidebar.tsx

type Comment = {
  id: string;
  value: string;
};

type RemovedTextSidebarProps = {
  comments: Comment[];
  positions: Record<string, number>;
  hoveredCommentId: string | null;
  // Updated signature to include source for scroll sync logic
  onHover: (id: string | null, source: 'chat' | 'sidebar') => void;
  inlineCommentIds: Set<string>;
  onCommentClick: (id: string) => void;
};

const PADDING_BETWEEN_COMMENTS = 8; // in pixels
const ESTIMATED_HEIGHT = 50; // Use a reasonable estimate if element not rendered yet

export default function RemovedTextSidebar({ 
  comments, 
  positions, 
  hoveredCommentId, 
  onHover, 
  inlineCommentIds, 
  onCommentClick 
}: RemovedTextSidebarProps) {

  // Filter out comments that are currently shown inline
  const sidebarComments = comments.filter(c => !inlineCommentIds.has(c.id));

  if (sidebarComments.length === 0) {
    return null;
  }

  // Sort comments by their vertical position
  const sortedComments = [...sidebarComments].sort((a, b) => (positions[a.id] || 0) - (positions[b.id] || 0));
  
  const positionedComments = new Map<string, number>();
  let lastBottom = -Infinity; // Initialize to -Infinity so the first comment is not constrained

  sortedComments.forEach(comment => {
    // We use the prefixed ID here to get the height for overlap calculation
    // This assumes the elements from the *previous* render are available in the DOM
    const el = document.getElementById(`sidebar-comment-${comment.id}`);
    const height = el ? el.offsetHeight : ESTIMATED_HEIGHT;
    
    const desiredTop = positions[comment.id] || 0;

    let newTop = desiredTop;
    
    // ADJUSTMENT: Only apply the lastBottom constraint if the desiredTop causes overlap
    if (desiredTop < lastBottom) {
      newTop = lastBottom;
    }

    positionedComments.set(comment.id, newTop);
    // Update the bottom position for the next iteration
    lastBottom = newTop + height + PADDING_BETWEEN_COMMENTS;
  });

  return (
    <div className="relative h-full">
      {sortedComments.map((comment) => (
        <div
          // ADDED: Prefix the ID so it's unique from the chat icon ID, necessary for lookups
          id={`sidebar-comment-${comment.id}`}
          key={comment.id}
          onClick={() => onCommentClick(comment.id)}
          // UPDATED: Pass 'sidebar' as the source for scroll sync logic
          onMouseEnter={() => onHover(comment.id, 'sidebar')}
          onMouseLeave={() => onHover(null, 'sidebar')}
          className={`absolute w-full p-1 rounded transition-all duration-200 text-sm text-red-800 cursor-pointer line-through
          ${hoveredCommentId === comment.id ? 'bg-red-200/60' : ''}`}
          style={{ 
            top: `${positionedComments.get(comment.id) ?? 0}px`,
            backgroundColor: hoveredCommentId === comment.id ? 'rgba(254, 202, 202, 0.6)' : 'transparent',
          }}
        >
          {comment.value}
        </div>
      ))}
    </div>
  );
}