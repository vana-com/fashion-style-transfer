import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const IntersectionObserver = ({ children, onIntersect }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -50% 0px", amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      onIntersect();
    }
  }, [isInView]);

  return <div ref={ref}>{children}</div>;
};

export default IntersectionObserver;
