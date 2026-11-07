import {
  Box,
  Button,
  ColorField,
  ColorSwatchPicker,
  CopyButton,
  Label,
  Popover,
  SegmentedControl,
  Slider,
  Text,
  useTheme,
} from "@anyglade/kit";
import { Sliders } from "@anyglade/kit/icons";
import type { ReactNode } from "react";
import { accentPresets } from "./accent.ts";
import {
  settingsToCss,
  useThemeSettings,
  type ButtonShape,
  type TextScale,
} from "./theme-settings.ts";

const modes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

const buttonShapes: { id: ButtonShape; label: string }[] = [
  { id: "pill", label: "Pill" },
  { id: "rounded", label: "Like fields" },
];

const textScales: { id: TextScale; label: string }[] = [
  { id: "compact", label: "Smaller" },
  { id: "default", label: "Default" },
  { id: "large", label: "Larger" },
];

interface OptionsProps<T extends string> {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function Options<T extends string>({ label, options, value, onChange }: OptionsProps<T>) {
  return (
    <Setting label={label}>
      <SegmentedControl label={label} options={options} value={value} onChange={onChange} />
    </Setting>
  );
}

interface PercentSettingProps {
  label: string;
  minValue: number;
  maxValue: number;
  value: number;
  onChange: (value: number) => void;
}

function PercentSetting({ label, minValue, maxValue, value, onChange }: PercentSettingProps) {
  return (
    <Slider
      className="w-full"
      formatOptions={{ style: "unit", unit: "percent" }}
      maxValue={maxValue}
      minValue={minValue}
      step={25}
      value={value}
      onChange={(next) => onChange(next as number)}
    >
      <Label>{label}</Label>
      <Slider.Output />
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  );
}

function Setting({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box flexDirection="column" gap="s">
      <Text as="span" variant="caption" color="muted">
        {label}
      </Text>
      {children}
    </Box>
  );
}

export function ThemePanel() {
  const { theme, setTheme } = useTheme();
  const { settings, update, reset } = useThemeSettings();

  function resetAll() {
    reset();
    setTheme("system");
  }

  return (
    <Popover>
      <Button size="sm" variant="secondary">
        <Sliders />
        Theme
      </Button>
      <Popover.Content className="w-80" placement="bottom end">
        <Popover.Dialog aria-label="Theme settings">
          <Box flexDirection="column" gap="l">
            <Options label="Mode" options={modes} value={theme} onChange={setTheme} />
            <Setting label="Accent">
              <Box flexDirection="column" gap="s">
                <ColorSwatchPicker
                  aria-label="Preset colors"
                  value={settings.accent ?? undefined}
                  onChange={(color) => update({ accent: color.toString("hex") })}
                >
                  {accentPresets.map((color) => (
                    <ColorSwatchPicker.Item key={color} color={color}>
                      <ColorSwatchPicker.Swatch />
                      <ColorSwatchPicker.Indicator />
                    </ColorSwatchPicker.Item>
                  ))}
                </ColorSwatchPicker>
                <Box alignItems="center" gap="s">
                  <ColorField
                    aria-label="Custom color in hex"
                    className="w-full"
                    value={settings.accent}
                    onChange={(color) => update({ accent: color ? color.toString("hex") : null })}
                  >
                    <ColorField.Group>
                      <ColorField.Input placeholder="#000000" />
                    </ColorField.Group>
                  </ColorField>
                  <Button
                    isDisabled={settings.accent === null}
                    size="sm"
                    variant="ghost"
                    onPress={() => update({ accent: null })}
                  >
                    Monochrome
                  </Button>
                </Box>
              </Box>
            </Setting>
            <PercentSetting
              label="Radius"
              maxValue={200}
              minValue={0}
              value={settings.radius}
              onChange={(radius) => update({ radius })}
            />
            <PercentSetting
              label="Spacing"
              maxValue={150}
              minValue={75}
              value={settings.spacing}
              onChange={(spacing) => update({ spacing })}
            />
            <Options
              label="Buttons"
              options={buttonShapes}
              value={settings.buttonShape}
              onChange={(buttonShape) => update({ buttonShape })}
            />
            <Options
              label="Text size"
              options={textScales}
              value={settings.textScale}
              onChange={(textScale) => update({ textScale })}
            />
            <Box gap="s">
              <CopyButton
                fullWidth
                isLabelVisible
                copiedLabel="CSS copied"
                label="Copy CSS"
                size="sm"
                value={settingsToCss(settings)}
                variant="primary"
              />
              <Button size="sm" variant="ghost" onPress={resetAll}>
                Reset
              </Button>
            </Box>
          </Box>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
