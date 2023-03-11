import type React from 'react';

export const Link: React.FC<
  React.PropsWithChildren<{
    href: string;
  }>
> = ({ href, children }) => (
  <a className='underline underline-offset-2' href={href} target='_blank'>
    {children}
  </a>
);
