import { useRecoilValue } from 'recoil';
import {
  Button,
  H2Title,
  IconChevronRight,
  IconShield,
  MAIN_COLORS,
  Tag,
} from 'twenty-ui';

import { currentUserState } from '@/auth/states/currentUserState';
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useEmailPasswordResetLinkMutation } from '~/generated/graphql';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SettingsPath } from '@/types/SettingsPath';

const StyledTitleContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const StyledTitle = styled.div`
  flex-grow: 1;
  text-align: left;
`;

export const TwoFactorAuth = () => {
  const theme = useTheme();

  return (
    <>
      <H2Title
        title="Two-factor Authentication"
        description="Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in."
      />
      <Link to="two-factor-auth">
        <Button
          onClick={() => {}}
          variant="primary"
          fullWidth
          title={
            <StyledTitleContainer>
              <IconShield size={theme.icon.size.md} />
              <StyledTitle>Authenticator app</StyledTitle>
              <Tag text="Deactivated" color="gray" />
              <IconChevronRight size={theme.icon.size.md} />
            </StyledTitleContainer>
          }
        />
      </Link>
    </>
  );
};
