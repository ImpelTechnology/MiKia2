'use strict';
var registro;
app.mntOTs = kendo.observable({
    onShow: function () {
        var fecha = new Date();
        var year = fecha.getFullYear();
        var mes = fecha.getMonth();
        var dia = fecha.getDate();

        $("#FechaInicio").kendoDatePicker({
            ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
            min: new Date(1900, 0, 1),
            value: new Date(),
            format: "dd-MM-yyyy"
            //max: new Date(year, mes, dia)
        });
        $("#FechaFin").kendoDatePicker({
            ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
            min: new Date(1900, 0, 1),
            max: new Date(year, mes, dia),
            value: new Date(),
            format: "dd-MM-yyyy"
        });
    },
    afterShow: function () { },
    inicializa: function () {

    },
    datos: [],
    listViewClick: function (e) {
        try {
            var servicioOT = JSON.stringify(e.dataItem);
            sessionStorage.setItem("servicio", servicioOT);
            //window.location = "index.html#components/DetalleServicio/detalleservicio.html";
            kendo.mobile.application.navigate("components/DetalleOT/view.html");
        } catch (s) {
            alert(s);
        }
    }
});
app.localization.registerView('mntOTs');

function Consultar() {
    try {
        if (document.getElementById("FechaInicio").value == "" || !document.getElementById("FechaInicio").value) { alert("Fecha inicio no ha sido seleccionada"); return; }
        if (document.getElementById("FechaFin").value == "" || !document.getElementById("FechaFin").value) { alert("Fecha fin no ha sido seleccionada"); return; }
        var fechaI = new Date(document.getElementById("FechaInicio").value);
        var fechaF = new Date(document.getElementById("FechaFin").value);
        if (fechaI > fechaF) { mens("Error fecha inicio mayor a la final", "error"); return; }
    } catch (f) { alert(f); }
    var usu = localStorage.getItem("Inp_DatosUsuario");
    var Url = urlService + "/biss.sherloc/Services/SL/Sherloc/Sherloc.svc/Ordenes/" + "2," + datos_Cliente.chasis + "," + document.getElementById("FechaInicio").value + "," + document.getElementById("FechaFin").value;
    try {
        var infor;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infor = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;
                } catch (e) {
                    alert(e);
                }
            },
            error: function (err) {
                alert(JSON.stringify(err));
            }
        });

        /*
        codigo_empresa
        numero_ot
        nombre_taller
        estado_interno
        fecha_recepcion
        anio_ga35
        secuencia_orden
        kilometraje
        */

        $("#listView").kendoGrid({
            allowCopy: true,
            columns: [
                { field: "fecha_recepcion", title: "Fecha" },
                { field: "numero_ot", title: "No. OT" },
                { field: "nombre_taller", title: "Taller" },
                { field: "kilometraje", title: "Km." }
            ],
            dataSource: infor,
            selectable: "row",
            change: function (e) {
                var selectedRows = this.select();
                var selectedDataItems = [];
                for (var i = 0; i < selectedRows.length; i++) {
                    var dataItem = this.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }
                registro = selectedDataItems[0];
                kendo.mobile.application.navigate("components/DetalleOT/view.html");
            }
        });
    } catch (e) {
        alert(e);
    }
}
