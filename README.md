# idea-processor

The **idea-processor** is an experiment in improving the experience of writing. Since the point of writing is to (usually) express ideas, this app aims to shift the focus of manipulating text to the development and manipulation of ideas.

Starting from the observation that writing generally follows a process of developing ideas from the general to the specific, the **idea-processor** creates a tree structure for the expression of ideas. The root idea will be the most general idea, concept, or impulse for the document. The leaves of the tree are the sentences and paragraphs that will be collated to form the finished document. Everything in between is the record of iterative development of the ideas that form the whole.

Currently, the **idea-processor** also supports hiding ideas, re-ordering of ideas, and shifting ideas to different branches. Branches can be displayed in order of most recently modified.

Features in conception and development include: creating views that de-emphasize the ideas that are not being developed; providing a variety of algorithms to prompt new ideas; a view that renders a finished document from the leaves of the idea tree.

Prompting for new ideas will use keywords defined by the user, words and ideas found in other ideas already created, keywords pulled from research papers provided by the user, keywords pulled from document templates such as resumes, keywords pulled from documents to respond to such as job ads. The prompts should be formulated as questions, and ideas written in response would include a reference to the prompting question.

## Self-hosting only

This app is not currently hosted on a public web site, and probably never will.
It will eventually get packaged as an Electron app, but for the time being, it can be used by hosting it on one's own computer.
You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)

There are a few caveats to self-hosting. All of the data created by the app is stored in an IndexedDB database. This does effectively persist the data, but the data is still at risk of unfortunate deletion. For example, deleting browser history will delete it. Backing up the data is a great idea!
Further, the data is only accessible to the browser in which it was created. If you create an **idea-processor** document in Chrome, it will not be available from Firefox or another browser. If you decide to change the port from which it is hosted, the previously created data will be unavailable from the new port. If you host a different app from the same port, there is no threat to the data created with this app.

## Installation

* `git clone <repository-url>` this repository
* `cd idea-processor`
* `npm install`

## Running

* `ember serve` , you can optionally select a particular port number with `--port ####`
* Visit the app at the default port at [http://localhost:4200](http://localhost:4200), or the port you defined
