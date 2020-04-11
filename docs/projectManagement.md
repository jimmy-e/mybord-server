# Project Management

This document is used to outline current project management priorities.

## Table of Contents

* [I. Priority Levels](#i-priority-levels)   
* [II. Long Term](#ii-long-term)   

## I. Priority Levels

### A. Highest

### B. High

* get license
* use custom passport scripting from other branch
* convert schema files (mutations, queries, subscriptions) to TS
* make ports be env vars
 * remove 'request' from context in `initialzeServer`

### C. Medium

* create new db for docker
* add env vars in docker file
* hide db secrets in docker file
* change secrets
* make sure to lock down individual queries and subscriptions, mutations for prod app
* add password validation

### D. Low

## II. Long Term  

* add lazy loading and code splitting