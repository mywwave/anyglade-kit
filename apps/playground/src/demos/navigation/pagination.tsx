import { Box, Pagination } from "@anyglade/kit";
import { useState } from "react";

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  const totalPages = 3;

  return (
    <Pagination className="justify-center">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
            <Pagination.PreviousIcon />
            <Box as="span">Previous</Box>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Pagination.Item key={p}>
            <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
              {p}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage((p) => p + 1)}>
            <Box as="span">Next</Box>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
