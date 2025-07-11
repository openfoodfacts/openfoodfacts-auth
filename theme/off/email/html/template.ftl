<#macro emailLayout>
<html>
<!-- OFF specific changes: Add logo and background colour to emails. Note can't embedded images or SVGs as many emails clients don't support them -->
<body style="font-family:helvetica,arial,sans-serif;background-color:${properties.EMAIL_BACKGROUND_COLOR}">
    <img src="https://static.openfoodfacts.org/images/logos/off-logo-horizontal-light.png" alt="Open Food Facts" style="max-height:48px">
<!-- End of OFF specific changes: Add logo and background colour to emails -->
    <#nested>
</body>
</html>
</#macro>
