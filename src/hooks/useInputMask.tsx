import React, { useEffect, useMemo, useState } from 'react';

import { keys, keyList } from '../constants';
import { addAnchors, normalizePattern } from '../utils';

interface IPatternReplace {
  key: RegExp;
  value: RegExp;
}

interface IMask {
  readonly inputRef: React.RefObject<HTMLInputElement>;
  readonly mask: string;
  readonly replace: IPatternReplace;
  readonly strict?: boolean;
  readonly pattern?: string;
}

interface IReturnMask {
  readonly value: string;
  readonly error: string;
  readonly isValid: boolean;
  readonly onChange: () => void;
}

type TPosition = {
  positions: string[];
  index: number;
  length: number;
  cursor: number;
};

const useMask = ({
  inputRef,
  mask,
  replace,
  strict,
  pattern,
}: IMask): IReturnMask => {
  const [value, setValue] = useState<string>(mask);
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [position, setPosition] = useState<TPosition>({
    positions: [],
    index: 0,
    cursor: 0,
    length: 0,
  });
  const [changes, setChanges] = useState<boolean[]>([]);
  const [currentKey, setCurrentKey] = useState<string>('');

  const normalizedPattern = useMemo<string>(() => {
    if (typeof pattern === 'string') {
      return normalizePattern(pattern);
    }

    return '';
  }, [pattern]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setCurrentKey(e.key);
    };

    const removeEvent = () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      removeEvent();
    };
  }, [inputRef]);

  useEffect(() => {
    if (inputRef.current && typeof pattern === 'string') {
      inputRef.current.pattern = normalizedPattern;
      const isInputValid = inputRef.current.checkValidity();

      if (isInputValid) {
        setIsValid(true);
        setError('');
      } else {
        setIsValid(false);
        setError(inputRef.current.validationMessage);
      }
    }
  }, [inputRef, value]);

  useEffect(() => {
    if (strict === true) {
      const regExp = addAnchors(replace.key);
      const symbols: string[] = new Array(mask.length);
      let correct = 0;

      for (let index = 0; index < mask.length; index++) {
        const current = mask[index];

        if (regExp.test(current)) {
          symbols[index] = current;
          correct++;
        }
      }

      setPosition({
        positions: symbols,
        length: correct,
        index: 0,
        cursor: 0,
      });
    }
  }, []);

  useEffect(() => {
    if (!strict) {
      const regExp = addAnchors(replace.key);
      const sep: string[] = [];

      for (let index = 0; index < mask.length; index++) {
        const current = mask[index];

        if (!regExp.test(current)) {
          sep.push(current);
        }
      }

      const newChanges: boolean[] = new Array(sep.length + 1).fill(false);

      setPosition({
        ...position,
        positions: sep,
        index: 0,
        cursor: 0,
      });
      setChanges(newChanges);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(position.cursor, position.cursor);
    }
  }, [position.cursor, inputRef, value]);

  const onChange = () => {
    if (!inputRef.current) {
      return;
    }

    const valueRegExp = addAnchors(replace.value);

    if (strict === true) {
      if (!valueRegExp.test(currentKey)) {
        return;
      }

      const cursorPosition = inputRef.current.selectionStart!;
      let newValue = '';
      let isChanged = false;
      let pos = position.index;
      let { cursor } = position;

      if (cursorPosition !== cursor + 1 && pos !== 0) {
        pos = cursorPosition - 2;
        cursor = pos + 1;
      }

      for (let i = 0; i < mask.length; i++) {
        const item = position.positions[i];

        if (item !== undefined && i === pos && !isChanged) {
          newValue += currentKey;
          isChanged = true;
          pos++;
          cursor = pos + 1;
        } else if (item === undefined && i === pos) {
          newValue += value[i];
          pos++;
          cursor = pos + 1;
        } else {
          newValue += value[i];
        }
      }

      setPosition({
        ...position,
        index: pos,
        cursor,
      });
      setValue(newValue);
    } else {
      const cursorPosition = inputRef.current.selectionStart!;
      let newValue = '';
      const { positions } = position;
      let pos = cursorPosition - 2;
      let left = 0;
      let right = value.length - 1;
      let leftIndex = null;
      let rightIndex = null;
      let partIndex = 0;
      const newChanges: boolean[] = [...changes];

      if (keyList.includes(currentKey)) {
        pos = cursorPosition - 1;
      }

      while (left <= pos || right > pos) {
        if (left <= pos) {
          if (positions.includes(value[left])) {
            leftIndex = left + 1;
            partIndex++;
          }
          left++;
        }

        if (right > pos) {
          if (positions.includes(value[right])) {
            rightIndex = right - 1;
          }
          right--;
        }
      }

      if (leftIndex === null) {
        leftIndex = 0;
      }

      if (rightIndex === null) {
        rightIndex = value.length - 1;
      }

      if (
        !valueRegExp.test(currentKey) &&
        !keyList.includes(currentKey) &&
        currentKey !== positions[partIndex]
      ) {
        return;
      }

      if (currentKey === keys.backspace) {
        pos = cursorPosition;

        if (newChanges[partIndex] === false) {
          newValue = `${value.slice(0, leftIndex)}${value.slice(
            rightIndex + 1,
          )}`;
          pos = leftIndex - 1;
          newChanges[partIndex] = true;
        } else {
          if (value[pos] === positions[partIndex]) {
            newValue = value;
          } else {
            newValue = `${value.slice(0, pos)}${value.slice(pos + 1)}`;
          }

          pos--;
        }
      } else if (
        newChanges[partIndex] === false &&
        currentKey !== positions[partIndex]
      ) {
        newChanges[partIndex] = true;
        newValue = `${value.slice(0, leftIndex)}${currentKey}${value.slice(
          rightIndex + 1,
        )}`;
        pos = leftIndex;
      } else if (
        newChanges[partIndex] === true ||
        currentKey === positions[partIndex]
      ) {
        if (currentKey !== positions[partIndex]) {
          if (pos === -1) {
            newValue = `${currentKey}${value.slice(0, value.length)}`;
          } else {
            newValue = `${value.slice(0, pos + 1)}${currentKey}${value.slice(
              pos + 1,
              value.length,
            )}`;
          }

          pos++;
        } else {
          newValue = `${value.slice(0, pos + 1)}${
            positions[partIndex]
              ? value.slice(rightIndex + 1, value.length)
              : ''
          }`;
          newChanges[partIndex] = true;
          partIndex++;
          leftIndex = pos + 2;
          rightIndex = leftIndex;

          while (rightIndex < newValue.length) {
            if (positions[partIndex] === newValue[rightIndex + 1]) {
              break;
            }

            rightIndex++;
          }

          pos = rightIndex;
        }
      } else {
        newValue = value;
      }

      setChanges(newChanges);
      setPosition({
        ...position,
        index: pos,
        cursor: pos + 1,
      });
      setValue(newValue);
    }
  };

  return {
    isValid,
    value,
    error,
    onChange,
  };
};

export { useMask };
