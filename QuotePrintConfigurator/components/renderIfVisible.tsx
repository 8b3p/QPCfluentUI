import * as React from "react";
import {
  useState,
  useRef,
  useEffect,
  LegacyRef,
  ReactElement,
  JSXElementConstructor,
} from "react";

const isServer = typeof window === "undefined";

type Props = {
  defaultHeight?: number;
  visibleOffset?: number;
  root?: HTMLElement;
  children: ReactElement<any, string | JSXElementConstructor<any>>[];
};

const RenderIfVisible: React.FC<Props> = ({
  defaultHeight = 300,
  visibleOffset = 1000,
  root = null,
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(isServer);
  const placeholderHeight = useRef<number>(defaultHeight);
  const intersectionRef = useRef<HTMLDivElement>(null);

  // Set visibility with intersection observer
  useEffect(() => {
    if (intersectionRef.current) {
      const observer = new IntersectionObserver(
        entries => {
          if (typeof window !== undefined && window.requestIdleCallback) {
            window.requestIdleCallback(
              () => setIsVisible(entries[0].isIntersecting),
              {
                timeout: 600,
              }
            );
          } else {
            setIsVisible(entries[0].isIntersecting);
          }
        },
        { root, rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px` }
      );
      observer.observe(intersectionRef.current);
      return () => {
        if (intersectionRef.current) {
          observer.unobserve(intersectionRef.current);
        }
      };
    }
  }, [intersectionRef]);

  // Set height after render
  useEffect(() => {
    if (intersectionRef.current && isVisible) {
      placeholderHeight.current =
        intersectionRef.current.getBoundingClientRect().height;
    }
  }, [isVisible, intersectionRef]);

  return (
    <div
      ref={
        intersectionRef
          ? (intersectionRef as LegacyRef<HTMLDivElement>)
          : undefined
      }
    >
      {isVisible ? (
        <>{children}</>
      ) : (
        <div style={{ height: placeholderHeight.current }} />
      )}
    </div>
  );
};

export default RenderIfVisible;
