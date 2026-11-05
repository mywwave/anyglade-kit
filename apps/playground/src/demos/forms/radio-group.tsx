import { Box, Description, Radio, RadioGroup, Text } from "@anyglade/kit";

export function RadioGroupDemo() {
  return (
    <Box flexDirection="column" gap="2xl">
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Primary variant
        </Text>
        <RadioGroup defaultValue="option1" name="primary-plan" variant="primary">
          <Radio value="option1">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Option 1
            </Radio.Content>
            <Description>Standard styling with default background</Description>
          </Radio>
          <Radio value="option2">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Option 2
            </Radio.Content>
            <Description>Another option with primary styling</Description>
          </Radio>
        </RadioGroup>
      </Box>
      <Box flexDirection="column" gap="s">
        <Text as="p" variant="default" weight="medium" color="muted">
          Secondary variant
        </Text>
        <RadioGroup defaultValue="option1" name="secondary-plan" variant="secondary">
          <Radio value="option1">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Option 1
            </Radio.Content>
            <Description>Lower emphasis variant for use in surfaces</Description>
          </Radio>
          <Radio value="option2">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Option 2
            </Radio.Content>
            <Description>Another option with secondary styling</Description>
          </Radio>
        </RadioGroup>
      </Box>
    </Box>
  );
}
