import type { PropsWithChildren } from 'react';

type Props = {
  variant: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
};

const Typography = ({
  variant,
  children,
  className,
}: PropsWithChildren<Props>) => {
  switch (variant) {
    case 'h1':
      return (
        <h1
          // TODO prevent "undefined" className (check other places)
          className={`scroll-m-16 font-semibold mb-4 text-4xl lg:text-5xl lg:mb-8 ${className}`}
        >
          {children}
        </h1>
      );

    case 'h2':
      return (
        <h2
          className={`scroll-m-8 font-semibold mb-2 text-2xl lg:text-3xl lg:mb-4 ${className}`}
        >
          {children}
        </h2>
      );

    case 'h3':
      return (
        <h3
          className={`scroll-m-4 font-semibold mb-1 text-lg lg:text-xl lg:mb-2 ${className}`}
        >
          {children}
        </h3>
      );

    case 'h4':
      return (
        <h4
          className={`scroll-m-2 mb-0.5 text-md lg:text-lg lg:mb-1 ${className}`}
        >
          {children}
        </h4>
      );
  }
};

export default Typography;
