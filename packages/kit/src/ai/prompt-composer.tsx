"use client";

import { ArrowUp, Paperclip, StopFill, Xmark } from "@gravity-ui/icons";
import { TextArea } from "@heroui/react";
import type { FormEvent, KeyboardEvent, MouseEvent, ReactNode, Ref } from "react";
import { FileTrigger } from "react-aria-components";
import { Box } from "../box/box.tsx";
import { Button } from "../button/button.tsx";
import { Text } from "../text/text.tsx";

export interface PromptAttachment {
  id: string;
  name: string;
}

export interface PromptComposerProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  /** Sending turns into stopping in the same place, so the way out is always under the cursor. */
  isRunning: boolean;
  submitLabel: string;
  stopLabel: string;
  attachLabel: string;
  removeAttachmentLabel: string;
  attachments: readonly PromptAttachment[];
  onAttach: (files: File[]) => void;
  onRemoveAttachment: (id: string) => void;
  /** Model picker and context meter. */
  toolbar?: ReactNode;
  /** The text field, for a window that opens ready to type. */
  inputRef?: Ref<HTMLTextAreaElement>;
}

export function PromptComposer({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  onStop,
  isRunning,
  submitLabel,
  stopLabel,
  attachLabel,
  removeAttachmentLabel,
  attachments,
  onAttach,
  onRemoveAttachment,
  toolbar,
  inputRef,
}: PromptComposerProps) {
  const canSubmit = value.trim().length > 0 && !isRunning;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (canSubmit) {
      onSubmit();
    }
  }

  /** A press on empty space lands in the text, as it would in any field. */
  function focusText(event: MouseEvent<HTMLFormElement>) {
    const target = event.target as Element;
    if (!target.closest("button, input, textarea, [role=button]")) {
      event.preventDefault();
      event.currentTarget.querySelector("textarea")?.focus();
    }
  }

  function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      submit(event);
    }
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- mouse convenience only: the keyboard already reaches the text area
    <form className="ag-composer" onMouseDown={focusText} onSubmit={submit}>
      {attachments.length > 0 ? (
        <Box flexWrap="wrap" gap="xs">
          {attachments.map((file) => (
            <Box
              key={file.id}
              alignItems="center"
              gap="2xs"
              minWidth={0}
              paddingLeft="s"
              backgroundColor="background-card"
              borderRadius="s"
              motion="pop"
            >
              <Text as="span" variant="caption" truncate>
                {file.name}
              </Text>
              <Button
                isIconOnly
                aria-label={`${removeAttachmentLabel} ${file.name}`}
                size="sm"
                variant="ghost"
                onPress={() => onRemoveAttachment(file.id)}
              >
                <Xmark />
              </Button>
            </Box>
          ))}
        </Box>
      ) : null}
      <TextArea
        ref={inputRef}
        aria-label={label}
        className="ag-composer__input"
        fullWidth
        placeholder={placeholder}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={submitOnEnter}
      />
      <Box alignItems="center" justifyContent="between" gap="s" minWidth={0}>
        <Box alignItems="center" gap="xs" minWidth={0}>
          <FileTrigger allowsMultiple onSelect={(files) => onAttach([...(files ?? [])])}>
            <Button isIconOnly aria-label={attachLabel} size="sm" variant="ghost">
              <Paperclip />
            </Button>
          </FileTrigger>
          {toolbar}
        </Box>
        {isRunning ? (
          <Button
            key="stop"
            isIconOnly
            aria-label={stopLabel}
            size="sm"
            variant="secondary"
            onPress={onStop}
          >
            <Box as="span" display="inline-flex" motion="pop">
              <StopFill />
            </Box>
          </Button>
        ) : (
          <Button
            key="send"
            isDisabled={!canSubmit}
            isIconOnly
            aria-label={submitLabel}
            size="sm"
            type="submit"
          >
            <Box as="span" display="inline-flex" motion="pop">
              <ArrowUp />
            </Box>
          </Button>
        )}
      </Box>
    </form>
  );
}

export interface SuggestionsProps {
  label: string;
  items: readonly string[];
  onSelect: (item: string) => void;
}

export function Suggestions({ label, items, onSelect }: SuggestionsProps) {
  return (
    <Box as="ul" aria-label={label} flexWrap="wrap" gap="s" motion="enter">
      {items.map((item) => (
        <Box as="li" key={item} display="block">
          <Button size="sm" variant="secondary" onPress={() => onSelect(item)}>
            {item}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
