---
title: Components
layout: page-with-nav
permalink: /architecture/components/
---

Create your app out reusable, self-contained view components. These will be in 
the form of element directives for AngularJS.


Components are what make up the more complex "view pieces" of your app, which 
when pieced together, form pages of your app.


Points:

- Always use an element directive.
- Always use an isolate scope, and "pass in" information via attributes.
- Use attributes for when "events" happen within the component.
- Always use a controller - it makes things easier and consistent with all other
  components, esp the ones that specifically need a controller as a public 
  interface.
  - If needing to know when to initialize the component in the "post-link" phase
    so you can modify the DOM, create a public init() method and call it from the
    link() function
- Single responsibility: Take some data, and display to the user. Don't call
  services (that's the job of the page to marshal the data), don't do data
  transformations/filtering (likely the job of the service or domain object), 
  etc. 
  - Only job for logic here may be to format the data for the particular view.
  - There are some exceptions to the rule (for instance, you have a complex
    modal dialog that is used in many places in your app, and has to load data
    from a few places), but for the most part, keep your logic in your services
    and domain objects. Think: "If I need to use this logic somewhere else in 
    the app, where would it be reusable from?"
