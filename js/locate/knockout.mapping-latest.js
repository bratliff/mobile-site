// JavaScript Document

// Knockout Mapping plugin v2.1.1
// (c) 2012 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function (e) { "function" === typeof require && "object" === typeof exports && "object" === typeof module ? e(require("knockout"), exports) : "function" === typeof define && define.amd ? define(["knockout", "exports"], e) : e(ko, ko.mapping = {}) })(function (e, f)
{
    function K(a, b)
    {
        var c = f.getType, d, n = { include: !0, ignore: !0, copy: !0 }, g, h, i = 1, l = arguments.length; for ("object" !== c(a) && (a = {}); i < l; i++) for (d in b = arguments[i], "object" !== c(b) && (b = {}), b)
        {
            g = a[d]; h = b[d]; if (n[d] && "array" !== c(h))
            {
                if ("string" !== c(h)) throw Error("ko.mapping.defaultOptions()." +
d + " should be an array or string."); h = [h]
            } switch (c(h)) { case "object": g = "object" === c(g) ? g : {}; a[d] = K(g, h); break; case "array": g = "array" === c(g) ? g : []; a[d] = e.utils.arrayGetDistinctValues(e.utils.arrayPushAll(g, h)); break; default: a[d] = h } 
        } return a
    } function o() { var a = e.utils.arrayPushAll([{}, w], arguments); return a = K.apply(this, a) } function P(a, b)
    {
        var c = e.dependentObservable; e.dependentObservable = function (b, c, d)
        {
            var d = d || {}, f = d.deferEvaluation; b && "object" == typeof b && (d = b); var l = !1, k = function (b)
            {
                var c = t({ read: function ()
                {
                    l ||
(e.utils.arrayRemoveItem(a, b), l = !0); return b.apply(b, arguments)
                }, write: function (a) { return b(a) }, deferEvaluation: !0
                }); c.__ko_proto__ = t; return c
            }; d.deferEvaluation = !0; b = new t(b, c, d); b.__ko_proto__ = t; f || (a.push(b), b = k(b)); return b
        }; e.computed = e.dependentObservable; var d = b(); e.dependentObservable = c; e.computed = e.dependentObservable; return d
    } function B(a, b, c, d, n, g)
    {
        var h = e.utils.unwrapObservable(b) instanceof Array; void 0 !== d && f.isMapped(a) && (c = e.utils.unwrapObservable(a)[k], g = d = ""); var d = d || "", g = g || "",
i = function (a) { var b; if (d === "") b = c[a]; else if (b = c[d]) b = b[a]; return b }, l = function () { return i("create") instanceof Function }, E = function (a) { return P(F, function () { return i("create")({ data: a || b, parent: n }) }) }, s = function () { return i("update") instanceof Function }, q = function (a, c) { var d = { data: c || b, parent: n, target: e.utils.unwrapObservable(a) }; if (e.isWriteableObservable(a)) d.observable = a; return i("update")(d) }, u = v.get(b); if (u) return u; if (h)
        {
            var h = [], j = (u = i("key") instanceof Function) ? i("key") : function (a) { return a };
            e.isObservable(a) || (a = e.observableArray([]), a.mappedRemove = function (b) { var c = typeof b == "function" ? b : function (a) { return a === j(b) }; return a.remove(function (a) { return c(j(a)) }) }, a.mappedRemoveAll = function (b) { var c = z(b, j); return a.remove(function (a) { return e.utils.arrayIndexOf(c, j(a)) != -1 }) }, a.mappedDestroy = function (b) { var c = typeof b == "function" ? b : function (a) { return a === j(b) }; return a.destroy(function (a) { return c(j(a)) }) }, a.mappedDestroyAll = function (b)
            {
                var c = z(b, j); return a.destroy(function (a)
                {
                    return e.utils.arrayIndexOf(c,
j(a)) != -1
                })
            }, a.mappedIndexOf = function (b) { var c = z(a(), j), b = j(b); return e.utils.arrayIndexOf(c, b) }, a.mappedCreate = function (b) { if (a.mappedIndexOf(b) !== -1) throw Error("There already is an object with the key that you specified."); var c = l() ? E(b) : b; if (s()) { b = q(c, b); e.isWriteableObservable(c) ? c(b) : c = b } a.push(c); return c }); var m = z(e.utils.unwrapObservable(a), j).sort(), x = z(b, j); u && x.sort(); for (var u = e.utils.compareArrays(m, x), m = {}, x = [], o = 0, w = u.length; o < w; o++)
            {
                var y = u[o], p, r = G(g, b, o); switch (y.status)
                {
                    case "added": var A =
C(e.utils.unwrapObservable(b), y.value, j); p = B(void 0, A, c, d, a, r); l() || (p = e.utils.unwrapObservable(p)); r = L(e.utils.unwrapObservable(b), A, m); x[r] = p; m[r] = !0; break; case "retained": A = C(e.utils.unwrapObservable(b), y.value, j); p = C(a, y.value, j); B(p, A, c, d, a, r); r = L(e.utils.unwrapObservable(b), A, m); x[r] = p; m[r] = !0; break; case "deleted": p = C(a, y.value, j)
                } h.push({ event: y.status, item: p })
            } a(x); var t = i("arrayChanged"); t instanceof Function && e.utils.arrayForEach(h, function (a) { t(a.event, a.item) })
        } else if (H(b))
        {
            a = e.utils.unwrapObservable(a);
            if (!a) { if (l()) return m = E(), s() && (m = q(m)), m; if (s()) return q(m); a = {} } s() && (a = q(a)); v.save(b, a); M(b, function (d) { var f = G(g, b, d); if (e.utils.arrayIndexOf(c.ignore, f) == -1) if (e.utils.arrayIndexOf(c.copy, f) != -1) a[d] = b[d]; else { var h = v.get(b[d]) || B(a[d], b[d], c, d, a, f); if (e.isWriteableObservable(a[d])) a[d](e.utils.unwrapObservable(h)); else a[d] = h; c.mappedProperties[f] = true } })
        } else switch (f.getType(b))
        {
            case "function": s() ? e.isWriteableObservable(b) ? (b(q(b)), a = b) : a = q(b) : a = b; break; default: e.isWriteableObservable(a) ?
s() ? a(q(a)) : a(e.utils.unwrapObservable(b)) : (a = l() ? E() : e.observable(e.utils.unwrapObservable(b)), s() && a(q(a)))
        } return a
    } function L(a, b, c) { for (var d = 0, e = a.length; d < e; d++) if (!0 !== c[d] && a[d] === b) return d; return null } function N(a, b) { var c; b && (c = b(a)); "undefined" === f.getType(c) && (c = a); return e.utils.unwrapObservable(c) } function C(a, b, c)
    {
        a = e.utils.arrayFilter(e.utils.unwrapObservable(a), function (a) { return N(a, c) === b }); if (0 == a.length) throw Error("When calling ko.update*, the key '" + b + "' was not found!");
        if (1 < a.length && H(a[0])) throw Error("When calling ko.update*, the key '" + b + "' was not unique!"); return a[0]
    } function z(a, b) { return e.utils.arrayMap(e.utils.unwrapObservable(a), function (a) { return b ? N(a, b) : a }) } function M(a, b) { if (a instanceof Array) for (var c = 0; c < a.length; c++) b(c); else for (c in a) b(c) } function H(a) { var b = f.getType(a); return ("object" === b || "array" === b) && null !== a && "undefined" !== b } function G(a, b, c) { var d = a || ""; b instanceof Array ? a && (d += "[" + c + "]") : (a && (d += "."), d += c); return d } function I(a, b,
c, d)
    {
        void 0 !== d && f.isMapped(a) && (c = e.utils.unwrapObservable(a)[k], d = ""); void 0 === d && (v = new O); var d = d || "", n, g = e.utils.unwrapObservable(a); if (!H(g)) return b(a, d); b(a, d); n = g instanceof Array ? [] : {}; v.save(a, n); M(g, function (a)
        {
            if (!(c.ignore && e.utils.arrayIndexOf(c.ignore, a) != -1))
            {
                var i = g[a], l = G(d, g, a); if (!(e.utils.arrayIndexOf(c.copy, a) === -1 && e.utils.arrayIndexOf(c.include, a) === -1 && c.mappedProperties && !c.mappedProperties[l] && !(g instanceof Array))) switch (f.getType(e.utils.unwrapObservable(i)))
                {
                    case "object": case "array": case "undefined": var k =
v.get(i); n[a] = f.getType(k) !== "undefined" ? k : I(i, b, c, l); break; default: n[a] = b(i, d)
                } 
            } 
        }); return n
    } function O() { var a = [], b = []; this.save = function (c, d) { var f = e.utils.arrayIndexOf(a, c); 0 <= f ? b[f] = d : (a.push(c), b.push(d)) }; this.get = function (c) { c = e.utils.arrayIndexOf(a, c); return 0 <= c ? b[c] : void 0 } } var k = "__ko_mapping__", t = e.dependentObservable, J = 0, F, v, D = { include: ["_destroy"], ignore: [], copy: [] }, w = D; f.isMapped = function (a) { return (a = e.utils.unwrapObservable(a)) && a[k] }; f.fromJS = function (a)
    {
        if (0 == arguments.length) throw Error("When calling ko.fromJS, pass the object you want to convert.");
        window.setTimeout(function () { J = 0 }, 0); J++ || (F = [], v = new O); var b, c; 2 == arguments.length && (arguments[1][k] ? c = arguments[1] : b = arguments[1]); 3 == arguments.length && (b = arguments[1], c = arguments[2]); b = c ? o(c[k], b) : o(b); b.mappedProperties = b.mappedProperties || {}; var d = B(c, a, b); c && (d = c); --J || window.setTimeout(function () { e.utils.arrayForEach(F, function (a) { a && a() }) }, 0); d[k] = o(d[k], b); return d
    }; f.fromJSON = function (a) { var b = e.utils.parseJson(a); arguments[0] = b; return f.fromJS.apply(this, arguments) }; f.updateFromJS = function ()
    {
        throw Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!");
    }; f.updateFromJSON = function () { throw Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!"); }; f.toJS = function (a, b) { if (0 == arguments.length) throw Error("When calling ko.mapping.toJS, pass the object you want to convert."); b = o(a[k], b); return I(a, function (a) { return e.utils.unwrapObservable(a) }, b) }; f.toJSON = function (a, b) { var c = f.toJS(a, b); return e.utils.stringifyJson(c) }; f.visitModel = function (a, b, c)
    {
        if (0 == arguments.length) throw Error("When calling ko.mapping.visitModel, pass the object you want to visit.");
        c = o(a[k], c); return I(a, b, c)
    }; f.defaultOptions = function () { if (0 < arguments.length) w = arguments[0]; else return w }; f.resetDefaultOptions = function () { w = { include: D.include.slice(0), ignore: D.ignore.slice(0), copy: D.copy.slice(0)} }; f.getType = function (a) { if (a && "object" === typeof a) { if (a.constructor == (new Date).constructor) return "date"; if (a.constructor == [].constructor) return "array" } return typeof a } 
});

