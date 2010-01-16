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

<!-- Remove all comments -->
<xsl:template match="comment()"/>

<xsl:template match="xhtml:br">
  <xsl:value-of select="'&lt;br/&gt;'" disable-output-escaping="yes"/>
</xsl:template>

</xsl:stylesheet>