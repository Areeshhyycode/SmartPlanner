import { useState, useEffect, useRef } from 'react';

interface ExpandableContentProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

function ExpandableContent({ isExpanded, children }: ExpandableContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-out"
      style={{ height }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export default ExpandableContent;