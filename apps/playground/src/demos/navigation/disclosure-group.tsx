import { QrCode } from "@anyglade/kit/icons";
import { Box, Button, cn, Disclosure, DisclosureGroup, Separator, Text } from "@anyglade/kit";
import { LogoApple, Smartphone } from "@anyglade/kit/icons";
import React from "react";

export function DisclosureGroupDemo() {
  const [expandedKeys, setExpandedKeys] = React.useState(new Set<string | number>(["preview"]));

  return (
    <Box width="100%" maxWidth="28rem" display="block">
      <Box flexDirection="column" gap="l" padding="l">
        <DisclosureGroup expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
          <Disclosure aria-label="Preview HeroUI Native" id="preview">
            <Disclosure.Heading>
              <Button
                slot="trigger"
                variant={expandedKeys.has("preview") ? "secondary" : "tertiary"}
                className={cn("w-full border-none", {
                  "bg-transparent": !expandedKeys.has("preview"),
                })}
              >
                <Box width="100%" alignItems="center" justifyContent="start" gap="s">
                  <QrCode />
                  Preview HeroUI Native
                </Box>
                <Disclosure.Indicator className="text-muted" />
              </Button>
            </Disclosure.Heading>
            <Disclosure.Content>
              <Disclosure.Body>
                <Box
                  flexDirection="column"
                  alignItems="center"
                  gap="s"
                  padding="l"
                  textAlign="center"
                >
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
                      <Smartphone />
                      Preview on Expo Go
                    </Button>
                  </Box>
                </Box>
              </Disclosure.Body>
            </Disclosure.Content>
          </Disclosure>
          <Box marginVertical="s" display="block">
            <Separator />
          </Box>
          <Disclosure id="download">
            <Disclosure.Heading aria-label="Download HeroUI Native">
              <Button
                slot="trigger"
                variant={expandedKeys.has("download") ? "secondary" : "tertiary"}
                className={cn("w-full border-none", {
                  "bg-transparent": !expandedKeys.has("download"),
                })}
              >
                <Box width="100%" alignItems="center" justifyContent="start" gap="s">
                  <LogoApple />
                  Download App
                </Box>
                <Disclosure.Indicator className="text-muted" />
              </Button>
            </Disclosure.Heading>
            <Disclosure.Content>
              <Disclosure.Body>
                <Box
                  flexDirection="column"
                  alignItems="center"
                  gap="s"
                  padding="l"
                  textAlign="center"
                >
                  <Text as="p" variant="default" color="muted">
                    Download the HeroUI native app to explore our mobile components directly on your
                    device.
                  </Text>
                  <img
                    alt="App Store QR Code"
                    className="aspect-square w-full max-w-54 object-cover"
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/qr-code-native.png"
                  />
                  <Text as="p" variant="default" color="muted">
                    Available on iOS and Android devices.
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
        </DisclosureGroup>
      </Box>
    </Box>
  );
}
