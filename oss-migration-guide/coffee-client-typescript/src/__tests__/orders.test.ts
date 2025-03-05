/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { expect, test } from "vitest";
import { CoffeeClient } from "../index.js";
import { createTestHTTPClient } from "./testclient.js";

test("Orders Get Orders Multiple Orders", async () => {
  const testHttpClient = createTestHTTPClient("GetOrders-multiple_orders");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.list({});
  expect(result).toBeDefined();
  expect(result).toEqual([
    {
      id: 1,
      customerName: "Alice",
      coffeeType: "Latte",
      size: "Medium",
      extras: [
        "Extra shot",
        "Soy milk",
      ],
      price: 4.5,
    },
    {
      id: 2,
      customerName: "Bob",
      coffeeType: "Espresso",
      size: "Small",
      extras: [
        "Extra shot",
      ],
      price: 3.5,
    },
  ]);
});

test("Orders Get Orders Latte", async () => {
  const testHttpClient = createTestHTTPClient("GetOrders-latte");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.list({
    coffeeType: "Latte",
  });
  expect(result).toBeDefined();
  expect(result).toEqual([
    {
      id: 5,
      customerName: "Eve",
      coffeeType: "Mocha",
      size: "Large",
      extras: [
        "Whipped cream",
        "Chocolate syrup",
      ],
      price: 6,
    },
    {
      id: 6,
      customerName: "Grace",
      coffeeType: "Cold Brew",
      size: "Medium",
      extras: [
        "Vanilla syrup",
      ],
      price: 5.5,
    },
  ]);
});

test("Orders Get Orders Espresso", async () => {
  const testHttpClient = createTestHTTPClient("GetOrders-espresso");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.list({
    coffeeType: "Espresso",
  });
  expect(result).toBeDefined();
  expect(result).toEqual([
    {
      id: 5,
      customerName: "Eve",
      coffeeType: "Mocha",
      size: "Large",
      extras: [
        "Whipped cream",
        "Chocolate syrup",
      ],
      price: 6,
    },
    {
      id: 6,
      customerName: "Grace",
      coffeeType: "Cold Brew",
      size: "Medium",
      extras: [
        "Vanilla syrup",
      ],
      price: 5.5,
    },
  ]);
});

test("Orders Create Order Simple Order", async () => {
  const testHttpClient = createTestHTTPClient("CreateOrder-simple_order");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.create({
    id: 3,
    customerName: "Charlie",
    coffeeType: "Americano",
    size: "Large",
    price: 3.75,
  });
  expect(result).toBeDefined();
  expect(result).toEqual({
    id: 5,
    customerName: "Eve",
    coffeeType: "Mocha",
    size: "Large",
    extras: [
      "Whipped cream",
      "Chocolate syrup",
    ],
    price: 6,
  });
});

test("Orders Create Order Complex Order", async () => {
  const testHttpClient = createTestHTTPClient("CreateOrder-complex_order");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.create({
    id: 4,
    customerName: "Diana",
    coffeeType: "Cappuccino",
    size: "Medium",
    extras: [
      "Whipped cream",
      "Caramel syrup",
    ],
    price: 5.25,
  });
  expect(result).toBeDefined();
  expect(result).toEqual({
    id: 6,
    customerName: "Grace",
    coffeeType: "Cold Brew",
    size: "Medium",
    extras: [
      "Vanilla syrup",
    ],
    price: 5.5,
  });
});

test("Orders Get Order Order1", async () => {
  const testHttpClient = createTestHTTPClient("GetOrder-order1");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.getById({
    orderId: 1,
  });
  expect(result).toBeDefined();
  expect(result).toEqual({
    id: 5,
    customerName: "Eve",
    coffeeType: "Mocha",
    size: "Large",
    extras: [
      "Whipped cream",
      "Chocolate syrup",
    ],
    price: 6,
  });
});

test("Orders Get Order Order2", async () => {
  const testHttpClient = createTestHTTPClient("GetOrder-order2");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.getById({
    orderId: 2,
  });
  expect(result).toBeDefined();
  expect(result).toEqual({
    id: 6,
    customerName: "Grace",
    coffeeType: "Cold Brew",
    size: "Medium",
    extras: [
      "Vanilla syrup",
    ],
    price: 5.5,
  });
});

test("Orders Get Order Not Found", async () => {
  const testHttpClient = createTestHTTPClient("GetOrder-not_found");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.getById({
    orderId: 257133,
  });
  expect(result).toBeDefined();
});

test("Orders Update Order Order1", async () => {
  const testHttpClient = createTestHTTPClient("UpdateOrder-order1");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.update({
    orderId: 1,
    coffeeOrderUpdate: {
      coffeeType: "Cappuccino",
      extras: [
        "Cinnamon",
        "Whipped cream",
      ],
      price: 5.75,
    },
  });
  expect(result).toBeDefined();
  expect(result).toEqual({
    id: 6,
    customerName: "Grace",
    coffeeType: "Cold Brew",
    size: "Medium",
    extras: [
      "Vanilla syrup",
    ],
    price: 5.5,
  });
});

test("Orders Update Order Order2", async () => {
  const testHttpClient = createTestHTTPClient("UpdateOrder-order2");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.update({
    orderId: 2,
    coffeeOrderUpdate: {
      customerName: "Frank",
      size: "Small",
      extras: [
        "Sugar-free syrup",
      ],
    },
  });
  expect(result).toBeDefined();
  expect(result).toEqual({
    id: 6,
    customerName: "Grace",
    coffeeType: "Cold Brew",
    size: "Medium",
    extras: [
      "Vanilla syrup",
    ],
    price: 5.5,
  });
});

test("Orders Update Order Not Found", async () => {
  const testHttpClient = createTestHTTPClient("UpdateOrder-not_found");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  const result = await coffeeClient.orders.update({
    orderId: 488852,
    coffeeOrderUpdate: {
      coffeeType: "Cappuccino",
      extras: [
        "Cinnamon",
        "Whipped cream",
      ],
      price: 5.75,
    },
  });
  expect(result).toBeDefined();
});

test("Orders Delete Order Order1", async () => {
  const testHttpClient = createTestHTTPClient("DeleteOrder-order1");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  await coffeeClient.orders.delete({
    orderId: 1,
  });
});

test("Orders Delete Order Order2", async () => {
  const testHttpClient = createTestHTTPClient("DeleteOrder-order2");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  await coffeeClient.orders.delete({
    orderId: 2,
  });
});

test("Orders Delete Order Not Found", async () => {
  const testHttpClient = createTestHTTPClient("DeleteOrder-not_found");

  const coffeeClient = new CoffeeClient({
    serverURL: process.env["TEST_SERVER_URL"] ?? "http://localhost:18080",
    httpClient: testHttpClient,
    apiKeyAuth: "your-api-key-here",
  });

  await coffeeClient.orders.delete({
    orderId: 545907,
  });
});
