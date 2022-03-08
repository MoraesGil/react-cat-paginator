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

  const calculateRangeSlice = useCallback(
    index => {
      const min4SliceRange = Math.ceil(maxTilesRange * (index - 1) + 1);
      const max4SliceRange = Math.ceil(maxTilesRange * index);
      const isLastSlice = index === slices;
      const currentIsHigherEqualMin = currentPage >= min4SliceRange;
      const currentIsLowerEqualMax = currentPage <= max4SliceRange;
      const lastInnerPage = maxTilesRange / visibleTilesPerSlice;
      const belongsRange = currentIsLowerEqualMax && currentIsHigherEqualMin;
      const isFirstRenderLast = isLastSlice && !slicesRange[index];

      const getInnerRange = () =>
        createRangeArray(min4SliceRange, max4SliceRange);

      const defaultRender = () => {
        let pagination = [];
        let innerPages = 1;

        if (!belongsRange) {
          return paginate(getInnerRange(), visibleTilesPerSlice, 1);
        }

        do {
          pagination = paginate(
            getInnerRange(),
            visibleTilesPerSlice,
            innerPages
          );
          innerPages++;
        } while (!pagination.includes(currentPage));

        return pagination;
      };

      if (!belongsRange && slicesRange[index]) {
        return slicesRange[index];
      }

      if (slicesRange[index] && slicesRange[index].includes(currentPage)) {
        return slicesRange[index];
      }

      if (isFirstRenderLast) {
        return paginate(getInnerRange(), visibleTilesPerSlice, lastInnerPage);
      }
      return defaultRender();
    },

    [currentPage, visibleTilesPerSlice, maxTilesRange, slices, slicesRange]
  );

  const updateSliceRange = useCallback(() => {
    const computedRanges = createRangeArray(1, mustToSlice ? slices : 1).reduce(
      (acc, cur) => {
        const computedRange = calculateRangeSlice(cur);

        return { ...acc, [cur]: computedRange };
      },
      {}
    );

    setSlicesRange(computedRanges);
  }, [calculateRangeSlice, mustToSlice, slices]);
 

  useEffect(() => {
    updateSliceRange();
  }, [totalPages, setCurrentPage, currentPage, maxTiles, slices]);

  const renderEllipse = () => <Pagination.Ellipsis disabled />;

  const renderLink = number => (
    <Pagination.Item
      active={number === currentPage}
      onClick={() => handleClick(number)}
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

  const handleClick = number => {
    setCurrentPage(number);
  };
  const firstPage = () => {
    setCurrentPage(1);
  };
  const prevPage = () => {
    if (!disablePrev) {
      setCurrentPage(previousPageValue);
    }
  };
  const nextPage = () => {
    if (!disableNext) {
      setCurrentPage(nextPageValue);
    }
  };
  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <Pagination>
      <Pagination.First disabled={disablePrev} onClick={() => firstPage()} />
      <Pagination.Prev disabled={disablePrev} onClick={() => prevPage()} />
      <Pagination>{renderSlices()}</Pagination>
      <Pagination.Next disabled={disableNext} onClick={() => nextPage()} />
      <Pagination.Last disabled={disableNext} onClick={() => lastPage()} />
    </Pagination>
  );
};

export default CustomPagination;
