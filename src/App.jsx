/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(cat => {
    return product.categoryId === cat.id;
  }); // find by product.categoryId
  const user = usersFromServer.find(u => {
    return category.ownerId === u.id;
  }); // find by category.ownerId

  return { ...product, category, user };
});

function filterdProducts(
  productList,
  userFilter,
  categoiesFilters,
  searchQuote,
) {
  let filtered = productList;

  if (userFilter) {
    filtered = productList.filter(product => {
      return product.user.name === userFilter;
    });
  }

  if (categoiesFilters.length > 0) {
    filtered = filtered.filter(product => {
      return categoiesFilters.includes(product.categoryId);
    });
  }

  if (searchQuote) {
    filtered = filtered.filter(product => {
      return product.name
        .toLowerCase()
        .includes(searchQuote.trim().toLowerCase());
    });
  }

  return filtered;
}

export const App = () => {
  const [userFilter, setUserFilter] = useState('');
  const [categoriesFilters, setCategoriesFilter] = useState([]);
  const [searchQuote, setSearchQuote] = useState('');

  const preparedProducts = filterdProducts(
    products,
    userFilter,
    categoriesFilters,
    searchQuote,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setUserFilter('')}
                className={cn({ 'is-active': !userFilter })}
              >
                All
              </a>
              {usersFromServer.map(user => {
                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({ 'is-active': userFilter === user.name })}
                    key={user.id}
                    onClick={() => setUserFilter(user.name)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuote}
                  onChange={event => {
                    setSearchQuote(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuote.length > 0 && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}

                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        setSearchQuote('');
                      }}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => setCategoriesFilter([])}
                className={cn(
                  { 'is-outlined': categoriesFilters.length > 0 },
                  'button',
                  'is-success',
                  'mr-6',
                )}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    data-cy="Category"
                    className={cn(
                      { 'is-info': categoriesFilters.includes(category.id) },
                      'button',
                      'mr-2',
                      'my-1',
                    )}
                    href="#/"
                    onClick={() => {
                      if (categoriesFilters.includes(category.id)) {
                        setCategoriesFilter(
                          categoriesFilters.filter(id => id !== category.id),
                        );
                      } else {
                        setCategoriesFilter([
                          ...categoriesFilters,
                          category.id,
                        ]);
                      }
                    }}
                    key={category.id}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setCategoriesFilter([]);
                  setUserFilter('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {preparedProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {preparedProducts.map(product => {
                  return (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        1
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': product.user.sex === 'm',
                          'has-text-danger': product.user.sex === 'f',
                        })}
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
