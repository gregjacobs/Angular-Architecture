---
title: "Architecture: Keep HTML Templates Short"
layout: page-with-nav
permalink: /architecture/keep-html-templates-short/
comments: true
---

You want to keep the HTML of your page templates short. 100 lines or 
less is a good goal, but 25 or less is probably ideal.

In order to do this, you want to break down your pages into sub 
[components]({{ site.baseurl }}/architecture/components).

Example of *messy* template:

{% highlight html %}
<div>
    <div class="header">
        <div>
            <span>{% raw %}{{ $ctrl.title }}{% endraw %}</span>
            <span>...</span>
        </div>
    </div>
    
    <div class="spinner" ng-if="$ctrl.pageState === 'loading'">
        <span class="spinner-icon"></span>
        <span>Loading...</span>
    </div>
        
    <div class="content" ng-if="$ctrl.pageState === 'loaded'">
        <div ng-repeat="item in $ctrl.items">
            <span>{% raw %}{{ item.name }}{% endraw %}</span>
            <span>{% raw %}{{ item.description }}{% endraw %}</span>
            <div>
                <button ng-click="$ctrl.edit( item )">Edit</button>
                <button ng-click="$ctrl.remove( item )">Remove</button>
            </div>
        </div>
        
        <div>
            <div>...</div>
            <div>
                <button ng-click="$ctrl.selectAll()">Select All</button>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <div>
            <span>...</span>
            <span>...</span>
        </div>
        <div>
            <span></span>
        </div>
        <div>
            <span>...</span>
        </div>
    </div>
</div>
{% endhighlight %}


Example of the same page nicely broken down into distinct components:

{% highlight html %}
<div>
    <app-header class="header" title="$ctrl.title"></app-header>
    
    <app-spinner ng-if="$ctrl.pageState === 'loading'"></app-spinner>
    
    <div class="content" ng-if="$ctrl.pageState === 'loaded'">
        <app-item 
            ng-repeat="item in $ctrl.items" 
            on-edit="$ctrl.edit( item )" 
            on-remove="$ctrl.remove( item )"></app-item>
        
        <app-items-options on-select-all="$ctrl.selectAll()"></app-items-options>
    </div>
    
    <app-footer></app-footer>
</div>
{% endhighlight %}

See [Components]({{ site.baseurl }}/architecture/components) guide for building components.
