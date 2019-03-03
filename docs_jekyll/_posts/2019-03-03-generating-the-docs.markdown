---
layout: post
title:  "Generating the docs with Jekyll"
date:   2019-03-03 17:11:27 +0100
categories: docs jekyll generate
---
Generate the docs from the Jekyll configuration.

Jekyll also offers powerful support for code snippets:

{% highlight bash %}
   cd .
   cd docs_jekyll
   bundle exec jekyll serve
{% endhighlight %}

Check out the [installation-notes](/installation_notes.txt) for more info.
{% highlight bash %}
   {% include _assets/installation_notes.txt %}      
{% endhighlight %}


[jekyll-docs]: http://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
