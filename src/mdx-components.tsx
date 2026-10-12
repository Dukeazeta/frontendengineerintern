import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes } from "react";

// Links in lesson text: Signal Blue text links; outside links open in a new tab.
function LessonLink({ href = "", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} className="text-link" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}

const components: MDXComponents = {
  a: LessonLink,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
