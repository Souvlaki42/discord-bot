import type { TableElement } from "./types";

export class Table {
  #elements: TableElement[];
  #title: string;
  #dashNumber: number;
  constructor(title: string, dashNumber: number) {
    this.#elements = [];
    this.#title = title;
    this.#dashNumber = dashNumber;
  }
  push(elem: TableElement): void {
    this.#elements.push(elem);
  }
  print(): void {
    const wholeLineDashNumber = 2 * this.#dashNumber + 2 + this.#title.length;
    console.log(
      `${"-".repeat(this.#dashNumber)} ${this.#title} ${"-".repeat(
        this.#dashNumber
      )}`
    );
    console.log("-".repeat(wholeLineDashNumber));
    if (this.#elements.length === 0) {
      console.log(
        `There is no ${[...this.#title]
          .slice(0, -1)
          .join("")
          .toLowerCase()} files at all!`
      );
    } else {
      this.#elements.map((element, index) => {
        console.log(
          ` ${index + 1}. | ${element.status} | ${element.name} - ${
            element.category
          }`
        );
      });
    }
    console.log(`${"-".repeat(wholeLineDashNumber)}\n`);
  }
}
