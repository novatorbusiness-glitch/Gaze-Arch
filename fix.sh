#!/bin/bash
# Remove the duplicate global styles inserted from lines 2090 to 2268 (which includes body, root, etc that conflicts)
sed -i '2090,2268d' css/style.css
# Change body styles in the appended section to .page-education
sed -i 's/^body {/.page-education {/g' css/style.css
