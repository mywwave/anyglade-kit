import { QrCode } from "@anyglade/kit/icons";
import { Box, Button, Disclosure, Text } from "@anyglade/kit";
import { LogoApple } from "@anyglade/kit/icons";
import React from "react";

export function DisclosureDemo() {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <Box width="100%" maxWidth="28rem" textAlign="center" display="block">
      <Disclosure isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
        <Disclosure.Heading>
          <Button slot="trigger" variant="secondary">
            <QrCode />
            Preview HeroUI Native
            <Disclosure.Indicator />
          </Button>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="shadow-panel rounded-3xl bg-surface">
            <Box flexDirection="column" alignItems="center" gap="s" padding="l" textAlign="center">
              <Text as="p" variant="default" color="muted">
                Scan this QR code with your camera app to preview the HeroUI native components.
              </Text>
              <img
                alt="Expo Go QR Code"
                className="aspect-square w-full max-w-54 object-cover"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/qr-code-native.png"
              />
              <Text as="p" variant="default" color="muted">
                Expo must be installed on your device.
              </Text>
              <Box marginTop="l" display="block">
                <Button variant="primary">
                  <LogoApple />
                  Download on App Store
                </Button>
              </Box>
            </Box>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </Box>
  );
}
