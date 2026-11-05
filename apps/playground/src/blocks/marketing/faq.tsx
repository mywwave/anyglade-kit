import { Accordion, Box, Text } from "@anyglade/kit";
import { ChevronDown } from "@anyglade/kit/icons";

const questions = [
  {
    title: "Можно ли сменить тариф?",
    answer: "Да, в любой момент. Разница пересчитается пропорционально оставшимся дням.",
  },
  {
    title: "Как работает возврат?",
    answer: "Возврат оформляется в один клик из карточки заказа и доходит за пять рабочих дней.",
  },
  {
    title: "Где хранятся данные?",
    answer: "На серверах в России. Резервные копии создаются каждый день.",
  },
];

export function FaqBlock() {
  return (
    <Box
      as="section"
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }}
      gap="2xl"
      padding={{ base: "xl", md: "3xl" }}
    >
      <Text as="h2" variant="heading-s">
        Частые вопросы
      </Text>
      <Accordion className="w-full">
        {questions.map((question) => (
          <Accordion.Item key={question.title}>
            <Accordion.Heading>
              <Accordion.Trigger>
                {question.title}
                <Accordion.Indicator>
                  <ChevronDown />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <Text color="muted">{question.answer}</Text>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  );
}
