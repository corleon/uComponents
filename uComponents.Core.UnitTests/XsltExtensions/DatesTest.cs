﻿using uComponents.Core.XsltExtensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Xml.XPath;
using System.Xml;

namespace uComponents.Core.UnitTests.XsltExtensions
{
	[TestClass]
	public class DatesTest
	{
		[TestMethod]
		public void AddWorkdaysTest()
		{
			var date = "24/06/2012";
			var days = 10;
			var expected = "09 July 2012";
			var actual = Dates.AddWorkdays(date, days);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void AddWorkdaysTest1()
		{
			var date = "24/06/2012";
			var days = 10;
			var format = "dd/MM/yyyy";
			var expected = "09/07/2012";
			var actual = Dates.AddWorkdays(date, days, format);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void AgeTest()
		{
			var dateOfBirth = "30/07/1978";
			var expected = 33;
			var actual = Dates.Age(dateOfBirth);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void DateWithinDurationTest()
		{
			var date = "24/06/2012";
			var duration = "P5D";
			var actual = Dates.DateWithinDuration(date, duration);
			Assert.IsTrue(actual);
		}

		[TestMethod]
		public void DateWithinLastDaysTest()
		{
			var date = "24/06/2012";
			var days = 5;
			var actual = Dates.DateWithinLastDays(date, days);
			Assert.IsTrue(actual);
		}

		[TestMethod]
		public void ElapsedSecondsTest()
		{
			var input = "24/06/2012 00:00";
			var actual = Dates.ElapsedSeconds(input);
			Assert.IsTrue(actual > 0F);
		}

		[TestMethod]
		public void FormatDateTimeTest()
		{
			var date = "23/06/2012";
			var format = "dddd ddS MMMM yyyy";
			var expected = "Saturday 23rd June 2012";
			var actual = Dates.FormatDateTime(date, format);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void GetFirstDayOfMonthTest()
		{
			var date = "24/06/2012";
			var expected = "01 June 2012";
			var actual = Dates.GetFirstDayOfMonth(date);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void GetFirstDayOfMonthTest1()
		{
			var date = "24/06/2012";
			var format = "dddd ddS MMMM yyyy";
			var expected = "Friday 01st June 2012";
			var actual = Dates.GetFirstDayOfMonth(date, format);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void GetLastDayOfMonthTest()
		{
			var date = "24/06/2012";
			var expected = "30 June 2012";
			var actual = Dates.GetLastDayOfMonth(date);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void GetLastDayOfMonthTest1()
		{
			var date = "24/06/2012";
			var format = "dddd ddS MMMM yyyy";
			var expected = "Saturday 30th June 2012";
			var actual = Dates.GetLastDayOfMonth(date, format);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void GetPrettyDateTest()
		{
			var date = "24/06/2012";
			var expected = "24 June 2012";
			var actual = Dates.GetPrettyDate(date);

			if (actual.StartsWith("24 June"))
			{
				Assert.AreEqual(expected, actual);
			}
			else if (DateTime.Today.Equals(new DateTime(2012, 06, 25)))
			{
				Assert.AreEqual("yesterday", actual);
			}
			else
			{
				Assert.AreNotEqual(string.Empty, actual);
			}
		}

		[TestMethod]
		public void GetPrettyDateTest1()
		{
			var date = "24/06/2012";
			var format = "dddd ddS MMMM yyyy";
			var expected = "Sunday 24th June 2012";
			var actual = Dates.GetPrettyDate(date, format);

			if (actual.StartsWith("Sunday"))
			{
				Assert.AreEqual(expected, actual);
			}
			else if (DateTime.Today.Equals(new DateTime(2012, 06, 25)))
			{
				Assert.AreEqual("yesterday", actual);
			}
			else
			{
				Assert.AreNotEqual(string.Empty, actual);
			}
		}

		[TestMethod]
		public void IsLeapYearTest()
		{
			var date = "24/06/2012";
			var actual = Dates.IsLeapYear(date);
			Assert.IsTrue(actual);
		}

		[TestMethod]
		public void IsWeekdayTest()
		{
			var date = "24/06/2012";
			var actual = Dates.IsWeekday(date);
			Assert.IsFalse(actual);
		}

		[TestMethod]
		public void IsWeekendTest()
		{
			var date = "24/06/2012";
			var actual = Dates.IsWeekend(date);
			Assert.IsTrue(actual);
		}

		[TestMethod]
		public void ListDatesTest()
		{
			var startDate = "24/06/2012";
			var endDate = "26/06/2012";

			var xml = new XmlDocument();
			xml.LoadXml("<values><value>2012-06-24T00:00:00</value><value>2012-06-25T00:00:00</value><value>2012-06-26T00:00:00</value></values>");

			var expected = xml.CreateNavigator().Select("/values");
			var actual = Dates.ListDates(startDate, endDate);

			Assert.AreEqual<XPathNodeIterator>(expected, actual); // TODO: [LK] How to compare an XPathNodeIterator?
			Assert.Inconclusive("Verify the correctness of this test method.");
		}

		[TestMethod]
		public void ParseExactTest()
		{
			var date = "24 June 2012";
			var inputFormat = "dd MMMM yyyy";
			var expected = "2012-06-24T00:00:00";
			var actual = Dates.ParseExact(date, inputFormat);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void ParseExactTest1()
		{
			var date = "24 June 2012";
			var inputFormat = "dd MMMM yyyy";
			var outputFormat = "dddd ddS MMMM yyyy";
			var expected = "Sunday 24th June 2012";
			var actual = Dates.ParseExact(date, inputFormat, outputFormat);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void ToUnixTimeTest()
		{
			var date = "24/06/2012 00:00";
			var expected = 1340496000F;
			var actual = Dates.ToUnixTime(date);
			Assert.AreEqual(expected, actual);
		}

		[TestMethod]
		public void WorkdaysDiffTest()
		{
			var startDate = "24/06/2012";
			var endDate = "30/06/2012";
			var expected = 5;
			var actual = Dates.WorkdaysDiff(startDate, endDate);
			Assert.AreEqual(expected, actual);
		}
	}
}