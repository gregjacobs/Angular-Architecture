Architecture / Software Development Guide:

From a high level:

1. Services
2. Domain Objects
3. Pages
4. Components
5. Controllers
6. Views (html templates)
7.



From the top down:

# Services

Services

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


# Controllers

These should be fairly light. The responsibility of the Controller is simply to
bring in data from the model (service) layer, and put it into the $scope for the
view to consume.

This process may optionally include some source data transformations, but
only those that specifically format the data for the particular view at hand.

Currently, some of our controllers are thousands of lines of code, and mix
many responsibilities, including:

- large amounts of state (which includes some very deeply nested objects)
- form validation
- handling the details of service errors and return statuses in large
  switch/case blocks
- different conditionals scattered around the code to manage iPhone and iPad
  differently
- DOM manipulation and DOM event handling
- etc.


#### What to do:

a. For pages that accept user input and handle validation and such, the
   controller should push that logic to different individual classes /
   implementations.

   For instance, a FormValidator class could be used to make sure the state of
   the form for a given page is correct.

b. Logic that controls possibly only a small part of the page can be broken
down into a separate child controller, or possibly a directive, depending on the
implementation.

c. Any individual DOM handling / DOM event handling code should be moved into
separate directives for the elements that they control.

d. For the separation of iPhone/iPad implementations (really Phone/Tablet), we
   should have a base class controller that holds common logic for both
   implementations, and then Phone and Tablet subclasses that implement the
   specifics of those implementations.

   This removes the DeviceDetection `if` statements which are scattered across
   the codebase. These often need to be added and maintained in pairs too. For
   example: we could need DeviceDetection to show some particular elements, and
   would subsequently need DeviceDetection to hide them.


# Directives

Reusable view components should be encapsulated into directives.  These
directives should only have data be passed in, and call handler functions when
something happens within them (i.e. limit them to input/events). They should
never directly access data from the model/service layer, or have side effects
(which would make them un-reusable).

For example:

    <ms-recent-quote-item
        quote=”myQuoteObject”         // pass in data
        on-remove=”handleRemove()”>   // handle an event
    </ms-recent-quote-item>


In general, use directives, and isolate scopes to give your directives their own
private set of scope properties. This will make it so they do not affect the
properties of outside scopes, except for those explicitly set up for two-way
binding.

Also, keep directives self-contained, never knowing about the outside world.
They should simply handle one piece of the DOM, and notify any listeners of
anything of interest that may have happened (i.e. user clicked on something,
user selected of something, user removed of something, etc.) via event handler
attributes. This makes them highly maintainable, reusable, and testable.


# Templates

HTML Templates should never be longer than 100 lines. Some of our templates are
packed with so many details of what could be self-contained child components
that they become unreadable.


#### What to do:

Use sub-templates or directives (preferred) to manage the length, and move the
details about how each component’s sub-elements are built into named
abstractions.

Offload logic that can be moved from a large monolithic controller into
sub-controllers or the directives’ link() functions as well, where appropriate.


# Domain Objects

We should use known domain objects for passing data around the system. Have
classes that represent each of the system’s entities:

- Account
- Transfer
- Payment
- Payee
- Deposit
- Holding
- etc.


Having domain objects provides us a place for abstracting the data, in the form
of accessor methods. For example, in `Account.js`:

    /**
     * Determines if the account is an ECL account
     *
     * @return {Boolean} `true` if it is an ECL account.
     */
    isEcl : function() {
        var novusCode = this.novusCode,
            subProduct = this.novusSubProduct;

        return this.AccountCategory === '1' &&
               ( novusCode === 'L' && subProduct === 'X' );
    }


Instead of duplicating this logic in controllers or somewhere else, it is now
always available when you have an `Account` instance.

Domain object classes also make every developer aware of what data is available
in a given class, simply by opening up its source file. We also immediately know
how to work with those domain objects when we see a common set of methods for
operating on the domain object’s data (ex: isEcl() method, above).


Current problem: Instead of generalizing data, the current SAL implementation
more-or-less tightly couples data requests to particular views in the app.

This is a problem for reusable view components. We want to be able to open, for
example, the Transfer Details popup, by passing in a known Transfer object. We
should not have different formats for the very same Transfer coming from
different services (which we currently do).

Solution: We need to work with SAL to generalized their data services. However,
we can circumvent this to an extent at the moment with factories that create
common domain objects based on the input service. Basically, these would apply
the necessary data transformations to convert from the source service formats →
common domain object format.



# File Organization

Seemingly subtle, but it is very powerful to group together files by
functionality, rather than “type of thingy” (which we currently have now with
the big controllers/directives/services/views directories).

Grouping by function makes it incredibly easy to spot a file’s related
dependencies and collaborators, because they all exist in the same directory.
The paradigm shifts us from having to attempt to search for / track down all of
the collaborators in the multiple directories, to immediately knowing the scope
of what’s involved in any given change.

Good articles on the subject:

- http://www.pseudobry.com/building-large-apps-with-angular-js/#fileorganization
- https://medium.com/opinionated-angularjs/scalable-code-organization-in-angularjs-9f01b594bf06



# Other smaller but just as important architecture items:

## Abstracting Cordova (and other 3rd Party Libraries)

Cordova always calls all callback functions asynchronously, which will be called
outside of the Angular event loop. Instead of needing to remember to call
`$scope.$apply()` in the callbacks (which has been the source of many bugs),
abstract the Cordova API into a new service which executes the `$apply()`
automatically.

This also gives us the chance to improve upon the Cordova APIs and make calling
them easier. For example, I did this for the Cordova notification API:

Original call to `confirm()`:

    window.navigator.notification.confirm(
        ‘You are about to download a large file. Continue?’,
        function( btnNum ) {
            $scope.$apply( function() {
                if( btnNum === 1 ) continueDownload();
            } );
        },
        ‘Warning’,
        [ ‘Yes’, ‘No’ ]
    );

New call to `confirm()`:

    Notification.confirm( {
        title   : ‘Warning’,
        message : ‘You are about to download a large file. Continue?’,
        buttons : [ ‘Yes’, ‘No’ ]
    } ).then( function( btnNum ) {
        if( btnNum === 1 ) continueDownload();
    } );


See `Notification.js` for implementation.




# General Best Practices

1. Take Every Opportunity to Improve the Code – Whether it is to better organize
   the code, add tests, clean up old code, etc. Moving to a better / more
   maintainable codebase is a constantly ongoing process that should happen
   during every day development.

   Don’t worry about making a pull request a little more complicated – we’re
   looking for the best end state here. However, if the changes are large, you
   could pull request the reorganization/refactoring commit(s) separately, and
   then the new feature/bugfix after. I would love to see every change involve a
   little bit of refactoring/cleanup/addition of tests, and then the addition of
   the new feature being developed.


2. Add Tests – Tests are invaluable for the long term development and
   maintenance of a codebase. Not only do they make sure that you’re code is
   correct at the time of writing, but they make sure that your code remains
   correct in the face of changes (which could be introduced in the coming days,
   weeks, months, or even years).

   Easily testable code also usually means that you have well-organized code.
   Testable code is:

      a. Small, cohesive, and single-purposed. If a given source file is large
         and has too many responsibilities, it will very be difficult to test.
      b. Loosely coupled. Dependencies are easy to substitute out and mock up in
         order to test the file at hand.

   Another advantage is that tests also help other developers to:

      a. Know how to use/call your code. This is especially so for reusable
         classes/services – the calling code is right there in the tests.
      b. Be able to modify your code, and not accidentally break existing
         functionality. A change that breaks a test immediately notifies the
         developer that he/she missed something, or didn’t account for a certain
         situation or edge case.
      c. Have a reasonable amount of confidence for development. The developer
         can run the test suite with his/her changes, and see if they have
         inadvertently affected the system, or if things still work well. This
         means no more flying blind.

   One note on tests: Tests should be written and maintained to the same quality
   standards as production code. They should be easily readable, follow the DRY
   principle (“don’t repeat yourself”), etc.

   Also, expect a large portion (half or even more) of the codebase to be
   composed of test code, and this is normal. Automated, repeatable tests that
   last the lifetime of the software ensure its correctness, speed up
   development, and reduce or remove regressions. This becomes even more
   important as the size of the project continues to grow, as developers come
   and go, and as other project lifecycle events happen.