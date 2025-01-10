import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { Button, CircularProgressBar, H2Title, Section } from 'twenty-ui';
import styled from '@emotion/styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUserState } from '@/auth/states/currentUserState';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CodeInput from '@/ui/input/components/CodeInput';
import { useNavigate } from 'react-router-dom';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';

const Styled2FAContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(8)};
  overflow: auto;
  padding: ${({ theme }) => theme.spacing(6, 8, 8)};
`;

const StyledQRCodeContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.color.gray10};
  border-radius: ${({ theme }) => theme.border.radius.xl};
  border: 1px solid ${({ theme }) => theme.color.gray20};
  justify-content: center;
  align-items: center;
  width: 105px;
  height: 105px;
  padding: 16px;
`;

const generateRandomBase32Secret = (length: number) => {
  const candidates = 'ABCDEFGHIJKLMNOPQRSTUV234567';
  return Array.from({ length })
    .map(() => candidates[Math.floor(Math.random() * candidates.length)])
    .join('');
};

export const TwoFactorAuthScreen = () => {
  // const currentUser = useRecoilValue(currentUserState);
  const navigate = useNavigate();

  const [totpSecret, setTotpSeret] = useState('');

  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useRecoilState(
    currentWorkspaceMemberState,
  );
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const { updateOneRecord: updateWorkspaceMemberData } = useUpdateOneRecord({
    objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
  });

  const isTotpConfigured = !!currentWorkspaceMember?.totpConfigured;

  useEffect(() => {
    if (isTotpConfigured) return;
    const generatedSecret = generateRandomBase32Secret(16);

    setTotpSeret(
      `otpauth://totp/Twenty:${currentUser?.email}?secret=${generatedSecret}&issuer=Twenty`,
    );
  }, [currentUser?.email, isTotpConfigured]);

  let content = null;

  if (isTotpConfigured) {
    content = (
      <H2Title
        title="TOTP already configured"
        description="TOTP has already been configured for this account."
      />
    );
  } else {
    content = (
      <>
        <Section>
          <H2Title
            title="Authenticator app"
            description="Authenticator apps and browser extensions like 1Password, Authy, Microsoft Authenticator, etc. generate one-time passwords that are used as a second factor to verify your identity when prompted during sign-in."
          />
          {totpSecret ? (
            <StyledQRCodeContainer>
              <QRCodeSVG value={totpSecret} />
            </StyledQRCodeContainer>
          ) : (
            <CircularProgressBar />
          )}
        </Section>
        <Section>
          <H2Title
            title="Verify the code from the app"
            description="Copy past the code below"
          />
          <CodeInput
            length={6}
            onAutoSubmit={async (inputValue: string) => {
              if (!currentWorkspaceMember) return;
              // TODO: API call to set totpConfigured to true, and set the totp on server
              console.log(inputValue);

              await updateWorkspaceMemberData({
                idToUpdate: currentWorkspaceMember.id,
                updateOneRecordInput: {
                  totpSecret,
                },
              });

              // setCurrentWorkspaceMember({
              //   ...currentWorkspaceMember,
              //   name: {
              //     firstName,
              //     lastName,
              //   },
              // });

              // navigate(SettingsPath.ProfilePage);
            }}
          />
        </Section>

        {isTotpConfigured && (
          <Section>
            <H2Title
              title="Disable two-factor Authentication"
              description="Disabling Two-factor Authentication significantly increases the risk of unauthorized access to your account."
            />
            <Button variant="secondary" accent="danger" title="Disable 2FA" />
          </Section>
        )}
      </>
    );
  }

  return (
    <SubMenuTopBarContainer
      title="Two-factor authentication"
      links={[
        {
          children: 'User',
          href: getSettingsPagePath(SettingsPath.ProfilePage),
        },
        {
          children: 'Profile',
          href: getSettingsPagePath(SettingsPath.ProfilePage),
        },
        { children: 'Two-factor-auth' },
      ]}
    >
      <Styled2FAContainer>{content}</Styled2FAContainer>
    </SubMenuTopBarContainer>
  );
};
