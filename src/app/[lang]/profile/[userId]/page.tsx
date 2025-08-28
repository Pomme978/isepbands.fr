import { use } from 'react';
import ProfilePageContent from '@/components/profile/ProfilePageContent';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = use(params);

  return <ProfilePageContent userId={userId} showBackButton={true} wrapInLayout={false} />;
}
