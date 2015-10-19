---
title: File Organization
layout: page-with-nav
permalink: /architecture/file-organization/
---

If you've done a large project, you know that the "recommended" (quote-unquote)
way of organizing files into controllers/directives/services/views directories 
quickly becomes unwieldy when you have 10+ files in each, let alone 100's of 
files.  

The **old** way of doing things:

    scripts
        controllers
            HomeController.js
            LoginController.js
            SettingsController.js
        directives
            dropdown.js
        filters
            specialValue.js
        services
            LoginService.js
            HomeService.js
            SettingsService.js
        app.js
    views
        dropdown.html
        home.html
        login.html
        settings.html
        

Instead, a **better** way is to organize by feature:

    app
        components
            dropdown
                dropdown.js
                dropdown.html
        home
            home.html
            home.js
        login
            login.html
            login.js
        settings
            settings.html
            settings.js
        app.js
        
        
This has the following advantages:

1. Grouping by feature/function makes it incredibly easy to spot a file’s 
   related dependencies and collaborators, because they all exist in the same 
   directory. The paradigm shifts us from having to attempt to search for / 
   track down all of the collaborators in the multiple directories, to 
   immediately knowing the scope of what’s involved in any given change.
2. It gives new (and current) developers a high level overview of what exists in
   the system. One can simply look at the directory structure.
   

## Slight Alternative

For the current project I'm working on, I chose to have separate `pages/` and 
`services/` directories because many pages of the app leverage a set of 
common services. The choice is ultimately up to you, but to give you an idea of
what this looks like:

    app
        components
            dropdown
                dropdown.js
                dropdown.html
        pages
            home
                home.html
                home.js
            login
                login.html
                login.js
            page1
            page2
            ...
            settings
                settings.html
                settings.js
        services
            login
                LoginService.js
                LoginResult.js
            settings
                SettingsService.js
            user
                UserRolesService.js
                UserPermissionsService.js
        app.js
       
       
       
Moral of the story is:

> Organize by feature


Good articles on the subject for continued reading:

- <http://www.pseudobry.com/building-large-apps-with-angular-js/#fileorganization>
- <https://medium.com/opinionated-angularjs/scalable-code-organization-in-angularjs-9f01b594bf06>