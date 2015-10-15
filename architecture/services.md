---
title: Services
layout: page-with-nav
permalink: /architecture/services/
---

Should simply access data, and be stateless (with the exception of caching). No
singleton should really have a “setter”.

The current idea of “Models” (which are singletons) are basically a
combination of:

- The data access layer
- State, which includes maintaining paging, increasing the time range of records
  to find, setting filters, etc. This state is carried over between pages, and
  unless “reset” properly, can inadvertently affect other pages (depending on
  which page a user accessed first).
- An assortment of utility and data querying methods that may or may not
  actually be related to the “Model” at hand.

Examples that mix responsibilities: TransferModel, PortfolioActivityModel


#### What to do:

a. Create an actual data access layer (DAL), which is usually comprised of
   classes (singletons) suffixed with the word ‘Service’.

   For example, I added the class ResearchService, which has a method
   loadDocument(). This method takes arguments for the particular document to
   load, and returns a promise (future) for when the document has been
   downloaded from the server. Straight input/output, and without side
   effects.

b. To handle things like loading pages of data, a separate, instantiable
   class should be used, which can maintain this state (page number, data for
   a particular data page, etc). This object should be able to be
   instantiated when needed, used, and then thrown away when no longer needed
   (i.e. user navigates to a different page), so that no state is
   accidentally transferred between pages.

c. For utility methods, these should be abstracted into different classes.

  i. Methods that deal with queries on the data most often belong on Domain
     Object classes (which would represent, for example, a single Account,
     Deposit, Transfer, etc.)

     For instance: TransferModel.accountIsInternal(account) should instead be:
     account.isInternal().

  ii. Other utility functionality should most often belong in a reusable class
  that has a single purpose.

     For instance: TransferModel has methods like getFirstBusinessDayOfMonth(),
     getLastBusinessDayOfMonth(), getHolidayList(), etc. These belong in a class
     such as Calendar instead.



Points:

- Talk about domain objects. Models and Collections. Backbone has this right.
  - Example: AccountsCollection object from Morgan Stanley app has filtering
    capabilities based on account name, account nickname, etc.