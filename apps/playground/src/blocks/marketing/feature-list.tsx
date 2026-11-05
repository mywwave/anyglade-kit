import { Box, Button, Modal, Text } from "@anyglade/kit";

const steps = [
  "Подключите кассу и банк, ключи вводятся один раз.",
  "Платежи и начисления сверяются сами каждую ночь.",
  "В понедельник отчёт и закрывающие документы готовы.",
];

export function FeatureListBlock() {
  return (
    <Box
      as="section"
      flexDirection="column"
      alignItems="start"
      gap="2xl"
      paddingHorizontal={{ base: "xl", md: "3xl" }}
      paddingVertical={{ base: "3xl", md: "4xl" }}
    >
      <Box display="block" maxWidth={880}>
        <Text as="h2" variant="heading-l" wrap="pretty">
          Подключите оплату за день.{" "}
          <Text as="span" variant="heading-l" color="muted">
            Начисления сходятся без ручной сверки.
          </Text>{" "}
          Отчёт готов к понедельнику.{" "}
          <Text as="span" variant="heading-l" color="muted">
            Закрывающие документы уходят сами.
          </Text>
        </Text>
      </Box>
      <Modal>
        <Button variant="secondary">Как это устроено</Button>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Три шага до отчёта</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <Box as="ol" flexDirection="column" gap="m">
                  {steps.map((step, index) => (
                    <Box as="li" key={step} display="flex" gap="m">
                      <Text as="span" color="muted" tabularNums>
                        {index + 1}
                      </Text>
                      <Text as="span">{step}</Text>
                    </Box>
                  ))}
                </Box>
              </Modal.Body>
              <Modal.Footer>
                <Button fullWidth slot="close">
                  Понятно
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </Box>
  );
}
