<#macro emailLayout>
<html>
<!-- OFF specific changes: Add logo and background colour to emails -->
<body style="font-family:helvetica,arial,sans-serif;background-color:#FFF2DF">
    <img style="max-height:48px" src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20version%3D%221.1%22%20viewBox%3D%220%200%20276%2048%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20transform%3D%22matrix(.33808%200%200%20.33808%20-33.118%20-33.121)%22%3E%3Crect%20class%3D%22g%22%20transform%3D%22rotate(-5%20570.23%20168.43)%22%20x%3D%22445.39%22%20y%3D%22123.94%22%20width%3D%22249.64%22%20height%3D%2288.95%22%20rx%3D%2214.78%22%20ry%3D%2214.78%22%20fill%3D%22%23ff8714%22%2F%3E%3Cg%20fill%3D%22%23fff%22%3E%3Cpath%20class%3D%22e%22%20d%3D%22m466.87%20204.98-4.8-54.85%2037.55-3.29%200.87%209.94-26.14%202.29%201.22%2013.92%2022.46-1.96%200.87%209.94-22.46%201.96%201.84%2021.06-11.41%201z%22%2F%3E%3Cpath%20class%3D%22e%22%20d%3D%22m535.65%20199.86c-4.12%200.36-8.01-0.02-11.67-1.13s-6.91-2.85-9.77-5.19c-2.85-2.35-5.16-5.17-6.94-8.48-1.77-3.31-2.84-6.97-3.19-11-0.35-4.02%200.05-7.82%201.19-11.38%201.15-3.56%202.92-6.73%205.33-9.52%202.4-2.78%205.31-5.04%208.72-6.77s7.2-2.78%2011.37-3.15%208.09%200%2011.75%201.12%206.91%202.83%209.76%205.16c2.85%202.32%205.15%205.14%206.9%208.45s2.8%206.98%203.15%2011c0.35%204.03-0.06%207.82-1.23%2011.38s-2.96%206.75-5.36%209.56-5.31%205.08-8.72%206.81-7.18%202.78-11.3%203.14zm-0.9-10.31c2.5-0.22%204.78-0.86%206.84-1.93s3.83-2.47%205.31-4.21%202.57-3.75%203.26-6.03c0.69-2.29%200.92-4.75%200.69-7.41-0.23-2.65-0.89-5.03-1.96-7.14s-2.49-3.9-4.25-5.38-3.75-2.55-5.96-3.23c-2.21-0.67-4.57-0.9-7.07-0.68s-4.78%200.85-6.84%201.9-3.83%202.45-5.31%204.21-2.56%203.77-3.26%206.03c-0.69%202.26-0.92%204.72-0.69%207.37s0.89%205.04%201.96%207.17c1.08%202.13%202.5%203.92%204.25%205.38%201.76%201.45%203.75%202.53%205.96%203.23s4.57%200.94%207.07%200.72z%22%2F%3E%3Cpath%20class%3D%22e%22%20d%3D%22m598.24%20194.38c-4.12%200.36-8.01-0.02-11.67-1.13s-6.91-2.85-9.77-5.19c-2.85-2.35-5.16-5.17-6.94-8.48-1.77-3.31-2.84-6.97-3.19-11-0.35-4.02%200.05-7.82%201.19-11.38%201.15-3.56%202.92-6.73%205.33-9.52%202.4-2.78%205.31-5.04%208.72-6.77s7.2-2.78%2011.37-3.15c4.17-0.36%208.09%200%2011.75%201.12s6.91%202.83%209.76%205.16c2.85%202.32%205.15%205.14%206.9%208.45s2.8%206.98%203.15%2011c0.35%204.03-0.06%207.82-1.23%2011.38-1.17%203.57-2.96%206.75-5.36%209.56s-5.31%205.08-8.72%206.81-7.18%202.78-11.3%203.14zm-0.9-10.31c2.5-0.22%204.78-0.86%206.84-1.93s3.83-2.47%205.31-4.21%202.57-3.75%203.26-6.03c0.69-2.29%200.92-4.75%200.69-7.41-0.23-2.65-0.89-5.03-1.96-7.14s-2.49-3.9-4.25-5.38-3.75-2.55-5.96-3.23c-2.21-0.67-4.57-0.9-7.07-0.68s-4.79%200.85-6.85%201.9-3.83%202.45-5.31%204.21-2.56%203.77-3.26%206.03c-0.69%202.26-0.92%204.72-0.69%207.37s0.89%205.04%201.96%207.17c1.08%202.13%202.5%203.92%204.25%205.38%201.76%201.45%203.75%202.53%205.96%203.23s4.57%200.94%207.07%200.72z%22%2F%3E%3Cpath%20class%3D%22e%22%20d%3D%22m633.94%20190.37-4.8-54.85%2017.89-1.57c5.94-0.52%2011.2%200.21%2015.77%202.18s8.24%204.92%2011.01%208.83c2.76%203.91%204.38%208.52%204.84%2013.82s-0.33%2010.13-2.37%2014.49-5.15%207.91-9.31%2010.65-9.21%204.37-15.15%204.89l-17.89%201.57zm10.54-10.94%206.77-0.59c3.58-0.31%206.61-1.31%209.09-2.98%202.47-1.68%204.32-3.89%205.54-6.64s1.67-5.9%201.36-9.43c-0.31-3.58-1.31-6.61-2.98-9.09-1.68-2.47-3.88-4.31-6.6-5.51-2.73-1.2-5.88-1.64-9.46-1.32l-6.77%200.59%203.06%2034.97z%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22m737.25%20128.92c-3.73%200-6.96%200.68-9.71%202.04s-4.86%203.33-6.34%205.9-2.22%205.72-2.22%209.45v1.51h-8.51v10.38h8.51v37.87h11.62v-37.87h10.73v-10.38h-10.73v-1.51c0-2.48%200.71-4.3%202.13-5.45s3.43-1.73%206.03-1.73c0.41%200%200.87%200.02%201.37%200.04%200.5%200.03%201.05%200.1%201.64%200.22v-10.02c-0.59-0.12-1.32-0.22-2.17-0.31-0.86-0.09-1.64-0.13-2.35-0.13z%22%2F%3E%3Cpath%20d%3D%22m775.73%20148.92c-3.02-1.45-6.51-2.17-10.47-2.17-3.25%200-6.27%200.53-9.05%201.6-2.78%201.06-5.19%202.53-7.23%204.39s-3.53%204.07-4.48%206.61l9.49%204.61c0.89-2.13%202.29-3.87%204.21-5.23s4.12-2.04%206.61-2.04c2.66%200%204.79%200.7%206.39%202.08%201.6%201.39%202.39%203.12%202.39%205.19v1.56l-14.28%202.34c-3.79%200.59-6.92%201.6-9.4%203.02s-4.33%203.18-5.54%205.28-1.82%204.48-1.82%207.14%200.68%205.22%202.04%207.32%203.3%203.71%205.81%204.83%205.45%201.69%208.83%201.69c2.66%200%205.07-0.35%207.23-1.06s4.11-1.77%205.85-3.19c0.71-0.58%201.37-1.22%202-1.89v5.09h11v-32.11c0-3.37-0.84-6.36-2.53-8.96s-4.04-4.63-7.05-6.08zm-3.64%2033.48c-1.01%201.83-2.44%203.27-4.3%204.3-1.86%201.04-4.01%201.55-6.43%201.55-1.89%200-3.47-0.49-4.75-1.46-1.27-0.98-1.91-2.29-1.91-3.95s0.56-3.09%201.69-4.12c1.12-1.03%202.84-1.76%205.14-2.17l12.06-2.14v2.05c0%202.13-0.5%204.11-1.51%205.94z%22%2F%3E%3Cpath%20d%3D%22m809.94%20159.3c1.98-1.21%204.24-1.82%206.79-1.82%202.72%200%205.13%200.72%207.23%202.17s3.59%203.41%204.48%205.9l10.2-4.52c-0.95-2.84-2.5-5.32-4.66-7.45s-4.72-3.8-7.67-5.01c-2.96-1.21-6.15-1.82-9.58-1.82-4.85%200-9.18%201.09-12.99%203.28s-6.82%205.17-9%208.96c-2.19%203.78-3.28%208.07-3.28%2012.86s1.11%209.09%203.33%2012.9%205.22%206.83%209%209.05%208.1%203.33%2012.95%203.33c3.49%200%206.71-0.61%209.67-1.82s5.5-2.9%207.63-5.06%203.67-4.6%204.61-7.32l-10.2-4.61c-0.95%202.48-2.44%204.46-4.48%205.94s-4.45%202.22-7.23%202.22c-2.54%200-4.81-0.62-6.79-1.86s-3.53-2.96-4.66-5.14c-1.12-2.19-1.69-4.7-1.69-7.54s0.56-5.28%201.69-7.49c1.12-2.22%202.67-3.93%204.66-5.14z%22%2F%3E%3Cpath%20d%3D%22m869.31%20186.4c-1.89%200-3.45-0.3-4.66-0.89s-2.1-1.45-2.66-2.57-0.84-2.48-0.84-4.08v-20.67h11.09v-10.38h-11.09v-11h-11.71v3.73c0%202.37-0.64%204.17-1.91%205.41s-3.09%201.86-5.45%201.86h-0.89v10.38h8.25v21.29c0%205.44%201.51%209.65%204.52%2012.64%203.02%202.99%207.24%204.48%2012.68%204.48%200.89%200%201.86-0.06%202.93-0.18%201.06-0.12%202.01-0.24%202.84-0.35v-9.93c-0.53%200.06-1.08%200.12-1.64%200.18s-1.05%200.09-1.46%200.09z%22%2F%3E%3Cpath%20d%3D%22m901.92%20168.39-7.72-2.31c-1.12-0.35-2.11-0.74-2.97-1.15s-1.52-0.94-2-1.6c-0.47-0.65-0.71-1.39-0.71-2.22%200-1.48%200.56-2.65%201.69-3.5%201.12-0.86%202.66-1.29%204.61-1.29%202.42%200%204.61%200.64%206.56%201.91s3.34%203%204.17%205.19l8.87-4.17c-1.48-3.96-3.96-7.04-7.45-9.22-3.49-2.19-7.51-3.28-12.06-3.28-3.49%200-6.58%200.62-9.27%201.86s-4.79%202.97-6.3%205.19-2.26%204.8-2.26%207.76c0%203.31%201.05%206.19%203.15%208.65%202.1%202.45%205.16%204.24%209.18%205.37l7.89%202.22c1.06%200.3%202.01%200.67%202.84%201.11s1.49%200.98%202%201.6c0.5%200.62%200.75%201.41%200.75%202.35%200%201.54-0.62%202.78-1.86%203.73s-2.9%201.42-4.97%201.42c-2.72%200-5.19-0.77-7.41-2.31s-3.95-3.67-5.19-6.39l-8.78%204.17c1.48%204.2%204.12%207.53%207.94%209.98%203.81%202.45%208.29%203.68%2013.44%203.68%203.67%200%206.86-0.62%209.58-1.86s4.85-2.97%206.39-5.19%202.31-4.77%202.31-7.67c0-3.43-1.08-6.33-3.24-8.69s-5.22-4.14-9.18-5.32z%22%2F%3E%3Cpath%20d%3D%22m258.53%20150.03c-3.84-2.19-8.16-3.28-12.95-3.28s-9.02%201.09-12.86%203.28-6.92%205.17-9.22%208.96c-2.31%203.78-3.46%208.1-3.46%2012.95s1.15%209.17%203.46%2012.95%205.39%206.77%209.27%208.96c3.87%202.19%208.14%203.28%2012.82%203.28s9.02-1.09%2012.86-3.28%206.92-5.17%209.22-8.96c2.31-3.78%203.46-8.1%203.46-12.95s-1.14-9.24-3.41-12.99c-2.28-3.75-5.34-6.73-9.18-8.91zm-1.29%2029.4c-1.15%202.22-2.72%203.95-4.7%205.19s-4.3%201.86-6.96%201.86-4.91-0.62-6.92-1.86-3.59-2.97-4.75-5.19c-1.15-2.22-1.73-4.71-1.73-7.49s0.58-5.26%201.73-7.45%202.73-3.9%204.75-5.14c2.01-1.24%204.32-1.86%206.92-1.86s4.98%200.62%206.96%201.86%203.55%202.96%204.7%205.14c1.15%202.19%201.73%204.67%201.73%207.45s-0.58%205.28-1.73%207.49z%22%2F%3E%3Cpath%20d%3D%22m316.23%20150.12c-3.67-2.25-7.78-3.37-12.33-3.37-3.72%200-7.01%200.72-9.84%202.17-2.27%201.16-4.16%202.7-5.68%204.6v-5.71h-11v65.99h11.71v-22.37c1.42%201.51%203.12%202.74%205.1%203.66%202.93%201.36%206.13%202.04%209.62%202.04%204.67%200%208.84-1.11%2012.51-3.33s6.56-5.25%208.69-9.09%203.19-8.1%203.19-12.77-1.08-8.99-3.24-12.77-5.07-6.8-8.74-9.05zm-1.86%2029.36c-1.18%202.19-2.79%203.9-4.83%205.14s-4.39%201.86-7.05%201.86-4.83-0.62-6.87-1.86-3.64-2.96-4.79-5.14c-1.15-2.19-1.73-4.7-1.73-7.54s0.58-5.26%201.73-7.45%202.75-3.9%204.79-5.14%204.33-1.86%206.87-1.86%205.01%200.62%207.05%201.86%203.65%202.96%204.83%205.14c1.18%202.19%201.77%204.67%201.77%207.45s-0.59%205.35-1.77%207.54z%22%2F%3E%3Cpath%20d%3D%22m373.71%20153.76c-2.01-2.19-4.45-3.9-7.32-5.14s-6.19-1.86-9.98-1.86c-4.55%200-8.63%201.09-12.24%203.28s-6.47%205.16-8.6%208.91c-2.13%203.76-3.19%208.06-3.19%2012.9s1.03%208.93%203.1%2012.77%204.98%206.89%208.74%209.14c3.75%202.25%208.12%203.37%2013.08%203.37%203.25%200%206.27-0.5%209.05-1.51%202.78-1%205.17-2.39%207.18-4.17%202.01-1.77%203.49-3.81%204.43-6.12l-9.4-4.61c-1.06%201.89-2.53%203.4-4.39%204.52s-4.12%201.69-6.79%201.69-5.01-0.62-7.05-1.86-3.58-3-4.61-5.28c-0.62-1.37-1.01-2.86-1.17-4.48h34.74c0.24-0.71%200.4-1.49%200.49-2.35s0.13-1.73%200.13-2.62c0-3.25-0.53-6.28-1.6-9.09-1.06-2.81-2.6-5.31-4.61-7.49zm-28.92%2012.59c0.2-1.02%200.48-1.96%200.85-2.84%200.98-2.31%202.41-4.08%204.3-5.32s4.05-1.86%206.47-1.86%204.71%200.62%206.52%201.86c1.8%201.24%203.1%202.93%203.9%205.06%200.36%200.97%200.58%202.01%200.65%203.1h-22.7z%22%2F%3E%3Cpath%20d%3D%22m420.44%20149.06c-2.75-1.54-5.9-2.31-9.45-2.31s-6.43%200.75-9%202.26c-1.99%201.16-3.53%202.75-4.66%204.74v-5.93h-11v48.25h11.71v-28.29c0-2.13%200.41-3.96%201.24-5.5s1.98-2.72%203.46-3.55%203.16-1.24%205.06-1.24%203.58%200.41%205.06%201.24%202.63%202.01%203.46%203.55%201.24%203.37%201.24%205.5v28.29h11.62v-31.04c0-3.61-0.77-6.79-2.31-9.53-1.54-2.75-3.68-4.89-6.43-6.43z%22%2F%3E%3Cpath%20class%3D%22f%22%20d%3D%22m97.97%20171.55c0-27.05%2021.93-48.98%2048.98-48.98s48.98%2021.93%2048.98%2048.98z%22%20fill%3D%22%23ff8c14%22%2F%3E%3Cpath%20class%3D%22e%22%20d%3D%22m183.52%20171.55c0%2020.2-16.37%2036.57-36.57%2036.57s-36.57-16.37-36.57-36.57h73.13z%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20class%3D%22h%22%20cx%3D%22163.54%22%20cy%3D%22139.92%22%20r%3D%222.69%22%20fill%3D%22%238c3c00%22%2F%3E%3Ccircle%20class%3D%22h%22%20cx%3D%22176.66%22%20cy%3D%22151.96%22%20r%3D%222.69%22%20fill%3D%22%238c3c00%22%2F%3E%3Ccircle%20class%3D%22h%22%20cx%3D%22161.82%22%20cy%3D%22154.91%22%20r%3D%222.69%22%20fill%3D%22%238c3c00%22%2F%3E%3Cpath%20d%3D%22m123.2%20214.37-8.7%2020.78%2011.45%204.8%208.78-20.96c3.91%201.01%208.01%201.55%2012.23%201.55%2027.01%200%2048.98-21.97%2048.98-48.98h-12.42c0%2020.16-16.4%2036.57-36.57%2036.57s-36.57-16.4-36.57-36.57h-12.42c0%2018.39%2010.2%2034.44%2025.23%2042.82z%22%2F%3E%3Cpath%20class%3D%22c%22%20d%3D%22m167.21%2097.97c-9.63%200-18%205.37-22.31%2013.27%203.32%203.08%205.81%207.03%207.11%2011.5%2011.21-2.52%2019.62-12.42%2019.82-24.34-1.5-0.28-3.04-0.43-4.62-0.43z%22%20fill%3D%22%2300641e%22%2F%3E%3Cpath%20class%3D%22d%22%20d%3D%22m127.62%20104.43c-1.91%200-3.76%200.22-5.55%200.61%203.07%2010.59%2012.83%2018.33%2024.4%2018.33%201.91%200%203.76-0.22%205.55-0.61-3.07-10.59-12.83-18.33-24.4-18.33z%22%20fill%3D%22%2300961e%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"/>
<!-- End of OFF specific changes: Add logo and background colour to emails -->
    <#nested>
</body>
</html>
</#macro>
