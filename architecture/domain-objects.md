---
title: Domain Objects
layout: page-with-nav
permalink: /architecture/domain-objects/
---

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



Points:

- Talk about Models and Collections. Backbone has this right.
  - Example: AccountsCollection object from Morgan Stanley app has filtering
    capabilities based on account name, account nickname, etc.
  - Don't do this filtering in views.