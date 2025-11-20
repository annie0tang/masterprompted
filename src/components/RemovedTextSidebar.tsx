// src/components/RemovedTextSidebar.tsx

type Comment = {
  id: string;
  value: string;
};

type RemovedTextSidebarProps = {
  comments: Comment[];
  positions: Record<string, number>;
  onHover: (id: string | null) => void;
  inlineCommentIds: Set<string>;
  onCommentClick: (id: string) => void;
  minHeight?: number; // New prop
};

const PADDING_BETWEEN_COMMENTS = 8;
const ESTIMATED_HEIGHT = 50;

export default function RemovedTextSidebar({ 
  comments, 
  positions, 
  onHover, 
  inlineCommentIds, 
  onCommentClick,
  minHeight = 0,
}: RemovedTextSidebarProps) {
  const sidebarComments = comments.filter(c => !inlineCommentIds.has(c.id));

  if (sidebarComments.length === 0) {
    return null;
  }

  const sortedComments = [...sidebarComments].sort((a, b) => (positions[a.id] || 0) - (positions[b.id] || 0));
  
  const positionedComments = new Map<string, number>();
  let lastBottom = -Infinity;

  sortedComments.forEach(comment => {
    const el = document.getElementById(`sidebar-${comment.id}`);
    const height = el ? el.offsetHeight : ESTIMATED_HEIGHT;
    
    const desiredTop = positions[comment.id] || 0;
    let newTop = desiredTop;
    
    if (desiredTop < lastBottom) {
      newTop = lastBottom;
    }

    positionedComments.set(comment.id, newTop);
    lastBottom = newTop + height + PADDING_BETWEEN_COMMENTS;
  });

  return (
    // Changed h-full to min-h-full and added style for explicit height
    <div 
      className="relative min-h-full" 
      style={{ height: minHeight }}
    >
      {sortedComments.map((comment) => (
        <div
          id={`sidebar-${comment.id}`}
          key={comment.id}
          onClick={() => onCommentClick(comment.id)}
          onMouseEnter={() => onHover(comment.id)}
          onMouseLeave={() => onHover(null)}
          className="absolute w-full p-1 rounded transition-colors duration-200 text-sm text-red-800 cursor-pointer line-through border border-red-200"
          style={{ 
            top: `${positionedComments.get(comment.id) ?? 0}px`,
          }}
        >
          {comment.value}
        </div>
      ))}
    </div>
  );
}