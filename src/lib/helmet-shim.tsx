import { Head } from 'vite-react-ssg';
import type { ReactNode } from 'react';

export const Helmet = Head;

export const HelmetProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
