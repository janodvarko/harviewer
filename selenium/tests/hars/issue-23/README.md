The 'external' URLs for the images in these HARs are relative and not
absolute. E.g.:

          "url": "/selenium/tests/hars/issue-23/poweredby_mediawiki_88x31.png",

This does not adhere to the HAR spec, http://www.softwareishard.com/blog/har-12-spec/#request,
but it means we don't have a dependency on a true external resource, which
could cause the test to fail (e.g. if the resource goes offline or the test
server cannot reach the original host).

An alternative to using relative URLs would be to generate the HARs at
test-time, using the hostname of the test server to generate an absolute URL
for the `request.url` field.
