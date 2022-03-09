import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

const createRangeArray = (start, end) => {
  let array = [];
  for (let index = start; index <= end; index++) {
    array.push(index);
  }
  return array;
};

const paginate = (array, page_size, page_number) => {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

const CustomPagination = ({
  totalPages,
  setCurrentPage,
  currentPage,
  maxTiles = 15,
  slices = 3
}) => {
  const nextPageValue = currentPage + 1;
  const previousPageValue = currentPage - 1;
  const visibleTilesPerSlice = Math.ceil(maxTiles / slices);
  const maxTilesRange = totalPages / slices;
  const disableNext = nextPageValue > totalPages;
  const disablePrev = previousPageValue < 1;
  const mustToSlice = totalPages > maxTiles;

  const [slicesRange, setSlicesRange] = useState({});

  const computeSlice = useCallback(
    (index, currentPage) => {
      const min4SliceRange = Math.ceil(maxTilesRange * (index - 1) + 1);
      const max4SliceRange = Math.ceil(maxTilesRange * index);
      const isLastSlice = index === slices;
      const currentIsHigherEqualMin = currentPage >= min4SliceRange;
      const currentIsLowerEqualMax = currentPage <= max4SliceRange;
      const lastInnerPage = maxTilesRange / visibleTilesPerSlice;
      const belongsRange = currentIsLowerEqualMax && currentIsHigherEqualMin;
      const notBelongsRange = !belongsRange;


      const renderCases = {
        notBelongsRangeAndExists: !belongsRange && slicesRange[index],
        alreadyRendered: slicesRange[index] && slicesRange[index].includes(currentPage),
        isFirstRenderLastSlice: isLastSlice && !slicesRange[index]
      }

      const renderCase = Object.keys(renderCases).filter((r) => renderCases[r])[0]

      const getInnerRange = () =>
        createRangeArray(min4SliceRange, max4SliceRange);

      const renders = {
        notBelongsRangeAndExists: () => slicesRange[index],
        alreadyRendered: () => slicesRange[index],
        isFirstRenderLastSlice: () => paginate(getInnerRange(), visibleTilesPerSlice, lastInnerPage),
        defaultRender: () => {

          if (notBelongsRange) {
            return paginate(getInnerRange(), visibleTilesPerSlice, 1);
          }

          let pagination = [];
          let innerPages = 1;

          do {
            pagination = paginate(
              getInnerRange(),
              visibleTilesPerSlice,
              innerPages
            );
            innerPages++;
          } while (!pagination.includes(currentPage));

          return pagination;
        },
      }

      const renderRange = renders[renderCase] || renders['defaultRender'];

      return renderRange();
    },

    [visibleTilesPerSlice, maxTilesRange, slices, slicesRange]
  );

  const computeSlices = useCallback(() => {
    const computedSlices = createRangeArray(1, mustToSlice ? slices : 1).reduce(
      (acc, cur) => {
        const computedRange = computeSlice(cur, currentPage);

        return { ...acc, [cur]: computedRange };
      },
      {}
    );
    if (computedSlices !== slicesRange) {

      setSlicesRange(computedSlices);
    }
  }, [computeSlice, currentPage, mustToSlice, slices, slicesRange]);

  useEffect(() => {
    computeSlices();
  }, [totalPages, currentPage, maxTiles, slices]);

  const renderEllipse = () => <Pagination.Ellipsis disabled />;

  const renderLink = number => (
    <Pagination.Item
      active={number === currentPage}
      onClick={() => clickHandler.handleClick(number)}
    >
      {number}
    </Pagination.Item>
  );

  const renderItems = sliceIndex => {
    return slicesRange[sliceIndex].map((item, index) => {
      const hasDivider = sliceIndex > 1 && index === 0;
      return (
        <React.Fragment key={`item-list-${item}`}>
          {hasDivider && renderEllipse(item)}
          {renderLink(item)}
        </React.Fragment>
      );
    });
  };

  const renderSlices = () => {
    return Object.keys(slicesRange).map(index => {
      return renderItems(index);
    });
  };

  const clickHandler = {
    handleClick: number => {
      setCurrentPage(number);
    },
    firstPage: () => {
      setCurrentPage(1);
    },
    prevPage: () => {
      if (!disablePrev) {
        setCurrentPage(previousPageValue);
      }
    },
    nextPage: () => {
      if (!disableNext) {
        setCurrentPage(nextPageValue);
      }
    },
    lastPage: () => {
      setCurrentPage(totalPages);
    },
  }

  return (
    <Pagination>
      <Pagination.First disabled={disablePrev} onClick={() => clickHandler.firstPage()} />
      <Pagination.Prev disabled={disablePrev} onClick={() => clickHandler.prevPage()} />
      <Pagination>{renderSlices()}</Pagination>
      <Pagination.Next disabled={disableNext} onClick={() => clickHandler.nextPage()} />
      <Pagination.Last disabled={disableNext} onClick={() => clickHandler.lastPage()} />
    </Pagination>
  );
};

export default CustomPagination;
