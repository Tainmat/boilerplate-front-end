import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Container, Controller, Item } from "@shared/components/Core/Pagination/Pagination.styles";
import { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";

interface Props {
  defaultCurrent?: number;
  pageSize: number;
  total: number;
  onChange?: (page: number) => void;
}

export function Pagination({ defaultCurrent, pageSize, total, onChange }: Props) {
  const maxPages = 5;

  const [pageAmount] = useState(Math.ceil(total / pageSize));

  const [list, setList] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(defaultCurrent || 1);

  const handleRender = useCallback(
    (currentPage: number) => {
      let array = Array.from({ length: pageAmount }).map((_, idx) => idx + 1);

      if (currentPage > array.length) {
        setCurrentPage(1);
      }

      if (currentPage <= maxPages - 2) {
        array.splice(5, array.length);
      } else {
        if (currentPage + (maxPages - 3) >= pageAmount) {
          const lastElementsArray = array.reverse();

          lastElementsArray.splice(maxPages, lastElementsArray.length);
          lastElementsArray.reverse();

          array = lastElementsArray;
        } else {
          array = array.filter((page) => page > currentPage - (maxPages - 2));
        }

        array.splice(maxPages, array.length);
      }

      setList(array);
    },
    [pageAmount],
  );

  useEffect(() => {
    handleRender(currentPage);

    onChange && onChange(currentPage);
  }, [handleRender, currentPage, onChange, defaultCurrent]);

  function handlePrevious() {
    setCurrentPage((current) => current - 1);
  }

  function handleNext() {
    setCurrentPage((current) => current + 1);
  }

  function handleOnClick(page: number) {
    setCurrentPage(page);
  }

  if (total <= pageSize) return null;

  if (list.length === 0) return null;

  return (
    <Container>
      <Controller>
        <ButtonIcon
          size="sm"
          icon="keyboard_arrow_left"
          disabled={currentPage === 1}
          onClick={() => handlePrevious()}
        />
      </Controller>

      {list.map((page) => (
        <Item key={v4()} active={page === currentPage} onClick={() => handleOnClick(page)}>
          {page}
        </Item>
      ))}

      <Controller>
        <ButtonIcon
          size="sm"
          icon="keyboard_arrow_right"
          disabled={currentPage === pageAmount}
          onClick={() => handleNext()}
        />
      </Controller>
    </Container>
  );
}
