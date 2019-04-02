import { Route } from "./route";
import { routes } from "../routes/__route-list";

export class RouteDocumentationGenerator {
  private static visitors = [
    {
      name: "Method",
      fn: (route: Route) => route.getMethod()
    },
    {
      name: "Url",
      fn: (route: Route) => route.getEndpoint()
    },
    {
      name: "Description",
      fn: (route: Route) => route.description.replace(/\n/g, "<br />")
    },
    {
      name: "Parameters",
      fn: (route: Route) => {
        return route.parameters
          .map(parameter => {
            return `**${parameter.getName()}** - Example: ${parameter.getExample()}`;
          })
          .join("<br />");
      }
    },
    {
      name: "Example response(s)",
      fn: (route: Route) => {
        return (
          `<div class="code">` +
          route.exampleResponses
            .map(res => RouteDocumentationGenerator.prettyPrintObject(res))
            .join("<br />or:<br />") +
          "</div>"
        );
      }
    },
    {
      name: "Side effects",
      fn: (route: Route) =>
        route.sideEffects.map(sideEffect => "- " + sideEffect).join(",<br />")
    }
  ];

  public static generate(): string {
    // create markdown headings
    let md = this.visitors.map(visitor => visitor.name).join("|"); // heading | heading | ...
    md += "\n" + this.visitors.map(() => "---").join("|"); // --- | --- | ...

    // add row for each route
    md +=
      "\n" +
      routes
        .map(route => this.visitors.map(visitor => visitor.fn(route)).join("|"))
        .join("\n");

    return md;
  }

  private static prettyPrintObject(ob, indent = "  ") {
    if (ob instanceof Array) {
      return (
        "[<br />" +
        ob
          .map(el => indent + this.prettyPrintObject(el, indent))
          .join(",<br />") +
        `<br />${indent.substr(2)}]`
      );
    }

    if (ob instanceof Object) {
      return (
        "{<br />" +
        Object.keys(ob)
          .map(
            key =>
              `${indent}"${key}": ` +
              this.prettyPrintObject(ob[key], indent + "  ")
          )
          .join(",<br />") +
        `<br />${indent.substr(2)}}`
      );
    }

    return JSON.stringify(ob);
  }
}
