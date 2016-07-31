* _Why?_: Using a class to represent a data model allows that data model to be
  easily documented across your system within the functions that data model is 
  passed to.

* _Why?_: A model's class definition immediately tells all developers exactly 
  which properties are going to be available on that object. With good 
  documentation (or even better, [TypeScript](https://www.typescriptlang.org)), 
  they also tell other developers which data types the properties hold.
  
* _Why?_: Data models/collections as classes allows you to add functionality in 
  the form of accessor/query methods. These methods can provide additional 
  information, or implement logic to provide data to the consumer that the 
  properties alone do not make obvious, or do not provide.