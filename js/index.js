const myTable = document.getElementById("html-data-table");
const tableNameDiv = document.querySelector(".table__name");
const paginationElement = document.getElementById("pagination");
const pageInfoDiv = document.getElementById("page-info");

let pageInfo = document.createElement("span");

let currentPage = 1;
let rows = 10;
let totalData = []; // Store all fetched data here
let totalFetchedCoins = 0; // Track total coins fetched so far

// Initial fetch
fetchData(0);

function fetchData(startIndex) {
  fetch(`https://api.coinlore.net/api/tickers/?start=${startIndex}&limit=100`)
    .then((res) => res.json())
    .then((coinData) => {
      const newCoins = coinData.data;
      totalData = totalData.concat(newCoins); // Append new coins to totalData
      totalFetchedCoins += newCoins.length;
      displayList(totalData, myTable, rows, currentPage);
      setupPagination(totalData, paginationElement, rows);
    })
    .catch((err) => {
      console.log(err);
    });
}

function displayList(items, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  let page_count = Math.ceil(items.length / rowsPerPage);
  let start = rowsPerPage * page;
  let end = start + rowsPerPage;

  // Dynamically update the "Showing X-Y of Z coins" text
  const totalItems = items.length;
  const showingStart = start + 1;
  const showingEnd = Math.min(end, totalItems);
  tableNameDiv.textContent = `Showing ${showingStart}-${showingEnd} of ${totalFetchedCoins} coins`;

  const sortedItems = items.sort((a, b) => a.index - b.index);
  let paginatedItems = sortedItems.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let newRow = document.createElement("tr");

    let coinCell = document.createElement("td");
    coinCell.textContent = paginatedItems[i].name;

    let codeCell = document.createElement("td");
    codeCell.textContent = paginatedItems[i].symbol;

    let priceCell = document.createElement("td");
    priceCell.textContent = paginatedItems[i].price_usd;

    let supplyCell = document.createElement("td");
    supplyCell.textContent = paginatedItems[i].tsupply;

    pageInfo.textContent = `PAGE ${page + 1} OF ${page_count}`;

    newRow.append(coinCell, codeCell, priceCell, supplyCell);
    wrapper.appendChild(newRow);
  }

  // If on the last page, fetch more coins
  if (page === page_count - 1 && totalItems === totalFetchedCoins) {
    fetchData(totalFetchedCoins); // Fetch next batch of 100 coins
  }
}

function setupPagination(items, wrapper, rowsPerPage) {
  wrapper.innerHTML = "";

  let page_count = Math.ceil(items.length / rowsPerPage);

  pageInfoDiv.appendChild(pageInfo);

  for (let i = 1; i < page_count + 1; i++) {
    let btn = paginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

function paginationButton(page, items) {
  let button = document.createElement("button");
  button.innerText = page;
  button.classList.add("btn");

  if (currentPage == page) button.classList.add("btn-active");

  button.addEventListener("click", function () {
    currentPage = page;

    displayList(items, myTable, rows, currentPage);

    let currentBtn = document.querySelector(".pagenumbers button.btn-active");
    currentBtn.classList.remove("btn-active");

    button.classList.add("btn-active");
  });

  return button;
}
