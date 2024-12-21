import styled from '@emotion/styled';
import { useState } from 'react';

const StyledDigitInput = styled.input`
  border: 1px solid ${({ theme }) => theme.color.gray20};
  background-color: ${({ theme }) => theme.color.gray10};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  height: 32px;
  text-align: center;
  width: 24px;
  caret-color: transparent;
`;

const StyledDigitInputContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const CodeInput = (props: {
  length: number;
  autoSubmitCallback?: (input: string[]) => void;
}) => {
  const { length = 6 } = props;
  const [value, setValue] = useState(Array.from({ length }).map(() => ''));
  return (
    <StyledDigitInputContainer>
      {Array.from({ length }).map((_, index) => (
        <StyledDigitInput
          placeholder="X"
          value={value[index]}
          onChange={(v) => {
            const inputEl = v.target;
            let inputValue = inputEl.value;
            setValue((current) => {
              const newValue = [...current];
              if (inputValue.length > 1 && current[index] !== '') {
                inputValue = inputValue.slice(1);
              }
              if (inputValue.length >= 1) {
                const startingIndex = Math.min(
                  length - inputValue.length,
                  index,
                );
                let currentInputEl = inputEl;
                for (let i = 0; i < inputValue.length; i++) {
                  newValue[startingIndex + i] = inputValue[i];
                  const nextInput =
                    currentInputEl.nextSibling as HTMLInputElement | null;
                  if (nextInput != null) {
                    nextInput.focus();
                    currentInputEl = nextInput;
                  } else {
                    inputEl.blur();
                  }
                }
              }
              return newValue;
            });
          }}
          onKeyUp={(e) => {
            const inputEl = e.target as HTMLInputElement;
            if (e.code === 'Backspace') {
              if (value[index] === '') {
                const previousInput =
                  inputEl.previousSibling as HTMLInputElement | null;
                if (value[index] === '') {
                  if (previousInput != null) {
                    previousInput.focus();
                  }
                }
              }
              setValue((current) => {
                const newValue = [...current];
                newValue[index] = '';
                return newValue;
              });
            }
          }}
        />
      ))}
    </StyledDigitInputContainer>
  );
};

export default CodeInput;
