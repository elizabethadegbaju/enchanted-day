import ReactMarkdown from 'react-markdown';
import { Box, Code, Text, UnorderedList, OrderedList, ListItem, Heading } from '@chakra-ui/react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <Heading as="h1" size="xl" mb={4}>{children}</Heading>,
        h2: ({ children }) => <Heading as="h2" size="lg" mb={3}>{children}</Heading>,
        h3: ({ children }) => <Heading as="h3" size="md" mb={2}>{children}</Heading>,
        p: ({ children }) => <Text mb={3}>{children}</Text>,
        ul: ({ children }) => <UnorderedList mb={3}>{children}</UnorderedList>,
        ol: ({ children }) => <OrderedList mb={3}>{children}</OrderedList>,
        li: ({ children }) => <ListItem>{children}</ListItem>,
        code: ({ children }) => <Code p={1} borderRadius="md">{children}</Code>,
        pre: ({ children }) => (
          <Box bg="gray.100" p={4} borderRadius="md" mb={3} overflowX="auto">
            {children}
          </Box>
        ),
        strong: ({ children }) => <Text as="strong" fontWeight="bold">{children}</Text>,
        em: ({ children }) => <Text as="em" fontStyle="italic">{children}</Text>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};