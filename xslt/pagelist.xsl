<?xml version="1.0"?>

<xsl:stylesheet version="2.0"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xhtml xsl xs">

<xsl:output method="html" version="1.0" encoding="UTF-8"
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    indent="yes"/>

<!-- Remove new lines -->
<xsl:strip-space  elements="*"/>

<!-- the identity template -->
<xsl:template match="@*|node()">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()"/>
  </xsl:copy>
</xsl:template>

<!-- Remove all script elements within the head that does *note* have
    an attribute 'preserve' with value set to 'true' -->
<xsl:template match="xhtml:head/xhtml:script[not(@preserve='true')]">
</xsl:template>

<!-- Remove all link elements -->
<xsl:template match="xhtml:link">
</xsl:template>

<!-- Remove all comments -->
<xsl:template match="comment()"/>

<!-- Append new script and link elements into the head.
    These contain all contatenated javascript and css files.
    to optimize page load performance -->
<xsl:template match="xhtml:head">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()"/>
    <link rel="StyleSheet" href="har.css" type="text/css"/>
    <script type="text/javascript" src="har.js"></script>
  </xsl:copy>
</xsl:template>

<xsl:template match="xhtml:br">
  <xsl:value-of select="'&lt;br/&gt;'" disable-output-escaping="yes"/>
</xsl:template>

</xsl:stylesheet>