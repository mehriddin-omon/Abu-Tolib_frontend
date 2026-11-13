import type { Metadata } from 'next';
import { TestsList } from './tests-list';

export const metadata: Metadata = { title: 'Testlar' };

export default function Page() {
  return <TestsList />;
}
