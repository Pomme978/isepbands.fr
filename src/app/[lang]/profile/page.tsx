import ProfilePageContent from '@/components/profile/ProfilePageContent';
import BasicLayout from '@/components/layouts/BasicLayout';

export default function ProfilePage() {
  return (
    <BasicLayout showNavbar={true} navbarMode="static" showFooter={true}>
      <ProfilePageContent wrapInLayout={false} />
    </BasicLayout>
  );
}
