function getLoadMoreButton() {
  const refs = {};
  const loadMore = render(
    refs,
    `
    <button ref="button" type="submit" class="ajax-pagination-btn btn color-border-default f6 mt-0 width-full" data-disable-with="Loading more…">
      Load more…
    </button>
    `
  );
  return {
    refs,
    node: loadMore,
  }
}