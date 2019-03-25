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
      name: "Parameters",
      fn: (route: Route) => {
        return route.parameters.map(parameter => {
          return `**${parameter.getName()}** - Example: ${parameter.getExample()}`;
        }).join("<br />");
      }
    },
  ];

  public static generate(): string {
    // create markdown headings
    let md = this.visitors.map(visitor => visitor.name).join("|"); // heading | heading | ...
    md += "\n" + this.visitors.map(() => "---").join("|"); // --- | --- | ...

    // add row for each route
    md += "\n" + routes.map(route => this.visitors
        .map(visitor => visitor.fn(route))
        .join("|")
    ).join("\n");

    return md;
  }
}
